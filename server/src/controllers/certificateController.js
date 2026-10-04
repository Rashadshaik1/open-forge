import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import Registration from '../models/Registration.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc Generate & stream verified PDF certificate with official template
// @route GET /api/certificates/download?eventId=...&rollNumber=...
// @access Public
export const downloadCertificate = async (req, res) => {
  try {
    const { eventId, rollNumber } = req.query;

    if (!eventId || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both eventId and rollNumber query parameters.',
      });
    }

    const user = await User.findOne({ rollNumber: rollNumber.trim().toUpperCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No student found with this roll number.',
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Verify door attendance
    const registration = await Registration.findOne({
      event: eventId,
      user: user._id,
      attended: true,
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'Certificate unavailable: Attendance was not verified at the venue for this roll number.',
      });
    }

    // Initialize A4 Landscape PDF (841.89 x 595.28 points)
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 0,
    });

    const safeTitle = event.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Certificate_${user.rollNumber}_${safeTitle}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    const templatePath = path.join(__dirname, '../assets/certificate_template.png');
    const templateExists = fs.existsSync(templatePath);

    if (templateExists) {
      // Draw background template across full canvas
      doc.image(templatePath, 0, 0, {
        width: doc.page.width,
        height: doc.page.height,
      });
    } else {
      // Fallback border & branding if template image is missing
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).strokeColor('#0f172a').stroke();
      doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52).lineWidth(1).strokeColor('#0284c7').stroke();

      doc.y = 60;
      doc.font('Helvetica-Bold').fontSize(26).fillColor('#0f172a').text('GAYATRI VIDYA PARISHAD', { align: 'center' });
      doc.font('Helvetica').fontSize(11).fillColor('#64748b').text('DEPARTMENT OF INFORMATION TECHNOLOGY • OPENFORGE', { align: 'center' });
      doc.moveDown(1);
      doc.font('Helvetica-Bold').fontSize(18).fillColor('#0284c7').text('CERTIFICATE OF PARTICIPATION', { align: 'center' });
    }

    // --- Dynamic Text Overlay Centered Block ---
    const contentWidth = 660;
    const contentX = (doc.page.width - contentWidth) / 2;

    // 1. Introductory phrase (starts well below pre-printed "CERTIFICATE OF PARTICIPATION")
    doc.y = 265;
    doc.font('Helvetica').fontSize(11.5).fillColor('#475569').text('This is to certify that', contentX, doc.y, {
      width: contentWidth,
      align: 'center',
    });

    // 2. Student Name
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#0f172a').text(user.name, contentX, doc.y, {
      width: contentWidth,
      align: 'center',
    });

    // 3. Roll Number & Department
    doc.moveDown(0.25);
    const departmentStr = user.department || 'Information Technology';
    const yearStr = user.year ? `, ${user.year}` : '';
    doc.font('Helvetica').fontSize(11.5).fillColor('#334155').text(
      `bearing Roll No. ${user.rollNumber} of ${departmentStr}${yearStr}`,
      contentX,
      doc.y,
      {
        width: contentWidth,
        align: 'center',
      }
    );

    // 4. Participation Statement
    doc.moveDown(0.4);
    doc.font('Helvetica').fontSize(11.5).fillColor('#475569').text(
      'has actively participated and demonstrated technical skills in the event',
      contentX,
      doc.y,
      {
        width: contentWidth,
        align: 'center',
      }
    );

    // 5. Event Title
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#E53E24').text(`"${event.title}"`, contentX, doc.y, {
      width: contentWidth,
      align: 'center',
    });

    // 6. Event Date & Venue (Finishes right around y = 415, safely above signatures)
    const formattedDate = new Date(event.eventDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    doc.moveDown(0.3);
    doc.font('Helvetica-Oblique').fontSize(10.5).fillColor('#64748b').text(
      `Conducted on ${formattedDate} at ${event.venue || 'GVPCE Campus'}`,
      contentX,
      doc.y,
      {
        width: contentWidth,
        align: 'center',
      }
    );

    // 7. Single-line Credential ID at the very bottom border
    doc.y = doc.page.height - 24;
    doc.font('Courier').fontSize(7.5).fillColor('#475569').text(
      `Credential ID: ${registration.ticketCode}  •  Digitally Verified via OpenForge Portal`,
      contentX,
      doc.y,
      {
        width: contentWidth,
        align: 'center',
        lineBreak: false,
      }
    );

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};