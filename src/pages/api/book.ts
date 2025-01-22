import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: "error", message: "Method not allowed" });
    }

    try {
        // Here you would typically save the booking to your database
        // For now, we'll just simulate a successful booking
        return res.status(200).json({ 
            status: "success",
            message: "Booking confirmed successfully"
        });
    } catch (error) {
        return res.status(500).json({ 
            status: "error", 
            message: "Error confirming booking" 
        });
    }
}