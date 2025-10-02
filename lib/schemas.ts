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
        content: { type: "string" },
        sources: {
          type: "array",
          items: { type: "string", minLength: 1 },
          minItems: 3
        }
      }
    }
  }
};

// Schema for overview sections - section-specific sources
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
          additionalProperties: false,
          required: ["content", "sources"],
          properties: {
            content: { type: "string" },
            sources: {
              type: "array",
              items: { type: "string" },
              minItems: 1
            }
          }
        },
        companyBackground: {
          type: "object",
          additionalProperties: false,
          required: ["content", "sources"],
          properties: {
            content: { type: "string" },
            sources: {
              type: "array",
              items: { type: "string" },
              minItems: 1
            }
          }
        },
        financialOverview: {
          type: "object",
          additionalProperties: false,
          required: ["content", "sources"],
          properties: {
            content: { type: "string" },
            sources: {
              type: "array",
              items: { type: "string" },
              minItems: 1
            }
          }
        },
        audienceSegmentation: {
          type: "object",
          additionalProperties: false,
          required: ["content", "sources"],
          properties: {
            content: { type: "string" },
            sources: {
              type: "array",
              items: { type: "string" },
              minItems: 1
            }
          }
        }
      }
    }
  }
};

// Revert to the working schema but allow more flexibility:
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
          additionalProperties: false,
          required: ["content"],
          properties: {
            content: { type: "string" }
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
          additionalProperties: false,
          required: ["content"],
          properties: {
            content: { type: "string" }
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
          additionalProperties: false,
          required: ["content"],
          properties: {
            content: { type: "string" }
          }
        },
        strategicFocus: {
          type: "object",
          additionalProperties: false,
          required: ["content"],
          properties: {
            content: { type: "string" }
          }
        }
      }
    }
  }
};
