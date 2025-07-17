import emailjs from 'emailjs-com';

// Cấu hình EmailJS
const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
};

export const sendBookingConfirmation = async (bookingDetails) => {
  try {
    const templateParams = {
      to_name: bookingDetails.userName,
      to_email: bookingDetails.userEmail,
      tour_name: bookingDetails.tourName,
      tour_location: bookingDetails.tourLocation,
      departure_date: bookingDetails.departureDate,
      amount: bookingDetails.amount,
      booking_id: bookingDetails.bookingId,
      payment_method: bookingDetails.paymentMethod
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

