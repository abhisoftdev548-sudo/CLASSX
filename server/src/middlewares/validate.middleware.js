// src/middlewares/validate.middleware.js

import * as z from "zod";



export const validate = (schema) => (req, res, next) => {

  // Debug logging to identify the issue

  console.log(' Validate Middleware Debug:');
  console.log("req", req)
  console.log("req cookie", req.cookies)

  console.log('Request Body:', req.body);

  console.log('Content-Type:', req.get('Content-Type'));

  console.log('Method:', req.method);

  console.log('URL:', req.url);

  console.log('Raw Headers:', JSON.stringify(req.headers, null, 2));

  console.log('Has Body:', !!req.body);

  console.log('Body Type:', typeof req.body);

  console.log('Body Keys:', req.body ? Object.keys(req.body) : 'N/A');



  try {

    // Check if req.body exists

    if (!req.body) {

      console.log(' Request body is undefined');

      return res.status(400).json({

        success: false,

        message: "Request body is missing",

        errors: [{ path: "body", message: "Request body is required" }]

      });

    }



    // FIX: yahan 'z.schema' ki jagah sirf 'schema' use karein

    schema.parse(req.body); 

    console.log(' Validation Passed');

    next();

  } catch (error) {

    if (error instanceof z.ZodError) {

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