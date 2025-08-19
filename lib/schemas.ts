export const companyOverviewSchema = {
  type: "json_schema",
  json_schema: {
    name: "CompanyOverview",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["section", "content_format", "content", "sources"],
      properties: {
        section: { type: "string", const: "companyOverview" },
        content_format: { type: "string", enum: ["markdown"] },
        content: { type: "string", minLength: 1 },
        sources: {
          type: "array",
          items: { type: "string", minLength: 1 },
          minItems: 3
        }
      }
    }
  }
};

// Schema for overview sections (company overview, background, financial, audience)
export const overviewSchema = {
  type: "json_schema",
  json_schema: {
    name: "CompanyOverview",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["companyOverview", "companyBackground", "financialOverview", "audienceSegmentation"],
      properties: {
        companyOverview: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", minLength: 100, maxLength: 200 }
          }
        },
        companyBackground: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", minLength: 150, maxLength: 400 }
          }
        },
        financialOverview: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", minLength: 100, maxLength: 250 }
          }
        },
        audienceSegmentation: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", minLength: 50, maxLength: 100 }
          }
        }
      }
    }
  }
};

// Schema for marketing activity (detailed, focused)
export const marketingSchema = {
  type: "json_schema",
  json_schema: {
    name: "MarketingActivity",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["marketingActivity"],
      properties: {
        marketingActivity: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", minLength: 600, maxLength: 900 }
          }
        }
      }
    }
  }
};

// Schema for sponsorships & experiential (detailed, focused)
export const sponsorshipsSchema = {
  type: "json_schema",
  json_schema: {
    name: "SponsorshipsExperiential",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["sponsorshipsExperiential"],
      properties: {
        sponsorshipsExperiential: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", minLength: 600, maxLength: 900 }
          }
        }
      }
    }
  }
};

// Schema for social media & strategic focus
export const socialMediaSchema = {
  type: "json_schema",
  json_schema: {
    name: "SocialMediaStrategic",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["socialMediaPresence", "strategicFocus"],
      properties: {
        socialMediaPresence: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", minLength: 350, maxLength: 500 }
          }
        },
        strategicFocus: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", minLength: 200, maxLength: 400 }
          }
        }
      }
    }
  }
};
