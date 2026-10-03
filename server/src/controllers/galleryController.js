import Gallery from '../models/Gallery.js';
import cloudinary from '../middleware/uploadMiddleware.js';

// @desc    Get all gallery items with filtering
// @route   GET /api/gallery
// @access  Public
export const getGalleryItems = async (req, res) => {
  try {
    const { category, academicYear, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (academicYear) filter.academicYear = academicYear;
    if (featured === 'true') filter.isFeatured = true;

    const items = await Gallery.find(filter)
      .populate('event', 'title eventDate')
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items: ' + error.message,
    });
  }
};

// @desc    Upload an image to gallery
// @route   POST /api/gallery
// @access  Private (Board & Admin only)
export const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file.',
      });
    }

    const { title, event, category, academicYear, isFeatured } = req.body;

    const galleryItem = await Gallery.create({
      title: title || 'Open Forge Event Memory',
      imageUrl: req.file.path,
      cloudinaryPublicId: req.file.filename,
      event: event || null,
      category: category || 'General',
      academicYear: academicYear || '2026-2027',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Photo uploaded to gallery successfully!',
      data: galleryItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo: ' + error.message,
    });
  }
};

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin only)
export const deleteGalleryImage = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    // Delete image from Cloudinary
    if (item.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(item.cloudinaryPublicId);
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item: ' + error.message,
    });
  }
};