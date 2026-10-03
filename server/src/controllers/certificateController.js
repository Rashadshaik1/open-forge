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

    // Verify verified door attendance
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
      // Graceful fallback if background template isn't placed yet
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).strokeColor('#0f172a').stroke();
      doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52).lineWidth(1).strokeColor('#0284c7').stroke();

      doc.y = 70;
      doc.font('Helvetica-Bold').fontSize(28).fillColor('#0f172a').text('OPEN FORGE', { align: 'center' });
      doc.font('Helvetica').fontSize(11).fillColor('#64748b').text('DEPARTMENT OF INFORMATION TECHNOLOGY • GVPCE (A)', { align: 'center' });
      doc.moveDown(1);
      doc.font('Helvetica-Bold').fontSize(16).fillColor('#0284c7').text('CERTIFICATE OF PARTICIPATION', { align: 'center' });
    }

    // --- Dynamic Text Overlay ---
    // Start text placement in the open middle section of the template
    doc.y = 210;

    doc.font('Helvetica').fontSize(13).fillColor('#475569').text('This is to certify that', { align: 'center' });

    // Student Name (Prominent)
    doc.moveDown(0.4);
    doc.font('Helvetica-Bold').fontSize(26).fillColor('#0f172a').text(user.name, { align: 'center' });

    // Roll number & Department
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(13).fillColor('#334155').text(
      `bearing Roll No. ${user.rollNumber} of ${user.department || 'Information Technology'}, ${user.year || 'GVPCE (A)'}`,
      { align: 'center' }
    );

    // Event participation sentence
    doc.moveDown(0.8);
    doc.font('Helvetica').fontSize(13).fillColor('#475569').text('has actively participated and demonstrated technical skills in the event', { align: 'center' });

    // Event Title
    doc.moveDown(0.4);
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#0369a1').text(`"${event.title}"`, { align: 'center' });

    // Event Date & Venue
    const formattedDate = new Date(event.eventDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    doc.moveDown(0.4);
    doc.font('Helvetica-Oblique').fontSize(11).fillColor('#64748b').text(
      `Conducted on ${formattedDate} at ${event.venue}`,
      { align: 'center' }
    );

    // Verification ID (Bottom Center / Left)
    doc.y = doc.page.height - 55;
    doc.font('Courier').fontSize(9).fillColor('#94a3b8').text(
      `Credential ID: ${registration.ticketCode}  |  Digitally Verified via Open Forge Portal`,
      { align: 'center' }
    );

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};