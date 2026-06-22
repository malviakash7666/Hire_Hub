import db from "../../models/index.js";

const { CompanyProfile } = db;

/**
 * CREATE COMPANY PROFILE
 */
export const createCompanyProfile = async (req, res) => {
  try {
    const {
      companyName,
      companyLogo,
      companyEmail,
      companyPhone,
      websiteUrl,
      industry,
      companySize,
      foundedYear,
      aboutCompany,
      country,
      state,
      city,
      address,
      pincode,
      socialLinks,
    } = req.body;

    const existingCompany = await CompanyProfile.findOne({
      where: {
        companyEmail,
      },
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company profile already exists with this email",
      });
    }

    const companyProfile = await CompanyProfile.create({
      companyName,
      companyLogo,
      companyEmail,
      companyPhone,
      websiteUrl,
      industry,
      companySize,
      foundedYear,
      aboutCompany,
      country,
      state,
      city,
      address,
      pincode,
      socialLinks,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Company profile created successfully",
      data: companyProfile,
    });
  } catch (error) {
    console.error("Create Company Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET ALL COMPANY PROFILES
 */
export const getAllCompanyProfiles = async (req, res) => {
  try {
    const companyProfiles = await CompanyProfile.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: companyProfiles.length,
      data: companyProfiles,
    });
  } catch (error) {
    console.error("Get All Company Profiles Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET SINGLE COMPANY PROFILE
 */
export const getSingleCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const companyProfile = await CompanyProfile.findByPk(id);

    if (!companyProfile) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: companyProfile,
    });
  } catch (error) {
    console.error("Get Single Company Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * UPDATE COMPANY PROFILE
 */
export const updateCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      companyName,
      companyLogo,
      companyEmail,
      companyPhone,
      websiteUrl,
      industry,
      companySize,
      foundedYear,
      aboutCompany,
      country,
      state,
      city,
      address,
      pincode,
      socialLinks,
      isVerified,
      isActive,
    } = req.body;

    const companyProfile = await CompanyProfile.findByPk(id);

    if (!companyProfile) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    await companyProfile.update({
      companyName:
        companyName ?? companyProfile.companyName,

      companyLogo:
        companyLogo ?? companyProfile.companyLogo,

      companyEmail:
        companyEmail ?? companyProfile.companyEmail,

      companyPhone:
        companyPhone ?? companyProfile.companyPhone,

      websiteUrl:
        websiteUrl ?? companyProfile.websiteUrl,

      industry:
        industry ?? companyProfile.industry,

      companySize:
        companySize ?? companyProfile.companySize,

      foundedYear:
        foundedYear ?? companyProfile.foundedYear,

      aboutCompany:
        aboutCompany ?? companyProfile.aboutCompany,

      country:
        country ?? companyProfile.country,

      state:
        state ?? companyProfile.state,

      city:
        city ?? companyProfile.city,

      address:
        address ?? companyProfile.address,

      pincode:
        pincode ?? companyProfile.pincode,

      socialLinks:
        socialLinks ?? companyProfile.socialLinks,

      isVerified:
        isVerified ?? companyProfile.isVerified,

      isActive:
        isActive ?? companyProfile.isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Company profile updated successfully",
      data: companyProfile,
    });
  } catch (error) {
    console.error("Update Company Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * DELETE COMPANY PROFILE
 */
export const deleteCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const companyProfile = await CompanyProfile.findByPk(id);

    if (!companyProfile) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    await companyProfile.destroy();

    return res.status(200).json({
      success: true,
      message: "Company profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Company Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};