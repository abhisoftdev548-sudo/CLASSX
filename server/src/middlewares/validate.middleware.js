// src/middlewares/validate.middleware.js

import * as z from "zod";



export const validate = (schema) => (req, res, next) => {

  try {

    // Check if req.body exists

    if (!req.body) {
      console.log("Request body is missing");
      return res.status(400).json({

        success: false,

        message: "Request body is missing",

        errors: [{ path: "body", message: "Request body is required" }]

      });

    }



    // FIX: yahan 'z.schema' ki jagah sirf 'schema' use karein

    schema.parse(req.body); 

    next();

  } catch (error) {
    console.log("Validation error:", error);

    if (error instanceof z.ZodError) {
      console.log("Zod error details:", error.errors);
      return res.status(400).json({

        success: false,

        message: error.message,

        errors: error.errors?.map((err) => ({

          path: err.path.join("."),

          message: err.message,

        })),

      });

    }



    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};