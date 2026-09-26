import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import MapEmbed from '../components/MapEmbed';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Navigation,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Check
} from 'lucide-react';

export default function Contact() {
  const { userCoords, requestLocation, isLocating, addToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Validation logic
  const validateField = (field, value) => {
    let error = '';

    if (field === 'name') {
      const trimmed = value.trim();
      if (!trimmed) {
        error = 'Full name is required.';
      } else if (trimmed.length < 2) {
        error = 'Name must be at least 2 alphabetic characters.';
      } else if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
        error = 'Name can only contain alphabetic letters and spaces.';
      }
    }

    if (field === 'email') {
      const trimmed = value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!trimmed) {
        error = 'Email address is required.';
      } else if (!emailRegex.test(trimmed)) {
        error = 'Please enter a valid email format (e.g. name@example.com).';
      }
    }

    if (field === 'subject') {
      const trimmed = value.trim();
      if (!trimmed) {
        error = 'Subject / Topic is required.';
      } else if (trimmed.length < 4) {
        error = 'Subject must be at least 4 characters long.';
      }
    }

    if (field === 'message') {
      const trimmed = value.trim();
      if (!trimmed) {
        error = 'Message details are required.';
      } else if (trimmed.length < 15) {
        error = `Message must be at least 15 characters (currently ${trimmed.length}).`;
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // 1. Full Name input change: Disallow numbers and symbols immediately
  const handleNameChange = (e) => {
    // Strip everything except letters and single whitespace
    const alphabeticOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
    setFormData((prev) => ({ ...prev, name: alphabeticOnly }));
    if (touched.name) {
      validateField('name', alphabeticOnly);
    }
  };

  // 2. Email input change: Disallow spaces
  const handleEmailChange = (e) => {
    const noSpaces = e.target.value.replace(/\s/g, '').toLowerCase().slice(0, 80);
    setFormData((prev) => ({ ...prev, email: noSpaces }));
    if (touched.email) {
      validateField('email', noSpaces);
    }
  };

  // 3. Subject input change: Max 100 chars, safe characters only
  const handleSubjectChange = (e) => {
    const cleanSubject = e.target.value.replace(/[^a-zA-Z0-9\s.,!?'"()&-]/g, '').slice(0, 100);
    setFormData((prev) => ({ ...prev, subject: cleanSubject }));
    if (touched.subject) {
      validateField('subject', cleanSubject);
    }
  };

  // 4. Message input change: Max 500 chars
  const handleMessageChange = (e) => {
    const cleanMessage = e.target.value.slice(0, 500);
    setFormData((prev) => ({ ...prev, message: cleanMessage }));
    if (touched.message) {
      validateField('message', cleanMessage);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const subjectErr = validateField('subject', formData.subject);
    const messageErr = validateField('message', formData.message);

    if (nameErr || emailErr || subjectErr || messageErr) {
      addToast('Please fix all field errors before submitting your message.', 'warning');
      return;
    }

    setSubmitted(true);
    addToast('Thank you for reaching out! Your message was received locally (Demo mode).', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
          <Phone className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
          Contact FreshFind Community
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Have a question about market schedules, want to register a new community farm stand, or need visitor directions? Reach out to our community coordinators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Static Contact Info & Geolocation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-soft space-y-6">
            <h2 className="text-xl font-extrabold text-stone-900">
              Platform & Office Details
            </h2>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold">Community Desk:</strong>
                  <span>Aptech Metro Star Gate Center, Karachi, Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold">Email Helpline:</strong>
                  <a href="mailto:team@freshfind.com" className="text-emerald-700 hover:underline">
                    team@freshfind.com
                  </a>
                  <span className="block text-xs text-stone-400">Response within 24 hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold">Operating Hours:</strong>
                  <span>Customer Support: 7 Days a week (8:00 AM - 7:00 PM)</span>
                </div>
              </div>
            </div>

            {/* Geolocation discovery helper */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                Need Help Locating Markets?
              </h3>
              <button
                type="button"
                onClick={requestLocation}
                disabled={isLocating}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {userCoords
                    ? 'Location Detected • Ready to Explore'
                    : isLocating
                    ? 'Detecting Location...'
                    : 'Use Browser Location for Directions'}
                </span>
              </button>
            </div>
          </div>

          {/* Embedded Map of the Community Center */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Central Location Map
            </h3>
            <MapEmbed
              title="Aptech Metro Star Gate Center"
              address="Aptech Metro Star Gate Center, Karachi, Pakistan"
              coordinates={{ lat: 24.8872, lng: 67.1518 }}
              height="260px"
            />
          </div>
        </div>

        {/* Right Column (7 cols): Contact Form with Strict Limitations */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-soft">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Send a Community Inquiry</span>
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Have feedback or want your local grower group added to the directory? Fill in the form below.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-emerald-900 text-base">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{formData.name || 'Friend'}</strong>! Your feedback has been verified and simulated locally. A community coordinator will review it during market hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                    setTouched({ name: false, email: false, subject: false, message: false });
                    setErrors({});
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name: Letters & Spaces ONLY */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="contact-name" className="text-xs font-bold text-stone-700">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-stone-400 font-medium">
                        Alphabets only ({formData.name.length}/50)
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="contact-name"
                        type="text"
                        required
                        maxLength={50}
                        value={formData.name}
                        onChange={handleNameChange}
                        onBlur={() => handleBlur('name')}
                        placeholder="e.g. Tariq Mansoor"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all focus:outline-none ${
                          touched.name && errors.name
                            ? 'bg-rose-50/40 border border-rose-400 text-stone-900 focus:ring-2 focus:ring-rose-400'
                            : touched.name && !errors.name && formData.name.length >= 2
                            ? 'bg-emerald-50/20 border border-emerald-500 text-stone-900 focus:ring-2 focus:ring-emerald-500'
                            : 'bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500'
                        }`}
                      />
                      {touched.name && !errors.name && formData.name.length >= 2 && (
                        <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-3 pointer-events-none" />
                      )}
                    </div>
                    {touched.name && errors.name && (
                      <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Address: Format strict validation */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="contact-email" className="text-xs font-bold text-stone-700">
                        Your Email Address <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-stone-400 font-medium">
                        name@domain.com
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="contact-email"
                        type="email"
                        required
                        maxLength={80}
                        value={formData.email}
                        onChange={handleEmailChange}
                        onBlur={() => handleBlur('email')}
                        placeholder="tariq@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all focus:outline-none ${
                          touched.email && errors.email
                            ? 'bg-rose-50/40 border border-rose-400 text-stone-900 focus:ring-2 focus:ring-rose-400'
                            : touched.email && !errors.email && formData.email.length > 5
                            ? 'bg-emerald-50/20 border border-emerald-500 text-stone-900 focus:ring-2 focus:ring-emerald-500'
                            : 'bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500'
                        }`}
                      />
                      {touched.email && !errors.email && formData.email.length > 5 && (
                        <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-3 pointer-events-none" />
                      )}
                    </div>
                    {touched.email && errors.email && (
                      <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject / Topic: 4-100 characters */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="contact-subject" className="text-xs font-bold text-stone-700">
                      Subject / Topic <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[10px] font-medium ${formData.subject.length > 90 ? 'text-amber-600' : 'text-stone-400'}`}>
                      {formData.subject.length}/100 chars (min 4)
                    </span>
                  </div>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    maxLength={100}
                    value={formData.subject}
                    onChange={handleSubjectChange}
                    onBlur={() => handleBlur('subject')}
                    placeholder="e.g. Inquiring about weekend stall booking"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all focus:outline-none ${
                      touched.subject && errors.subject
                        ? 'bg-rose-50/40 border border-rose-400 text-stone-900 focus:ring-2 focus:ring-rose-400'
                        : touched.subject && !errors.subject && formData.subject.length >= 4
                        ? 'bg-emerald-50/20 border border-emerald-500 text-stone-900 focus:ring-2 focus:ring-emerald-500'
                        : 'bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {touched.subject && errors.subject && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message Details: 15-500 characters */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="contact-message" className="text-xs font-bold text-stone-700">
                      Message Details <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[10px] font-medium ${formData.message.length > 450 ? 'text-amber-600' : 'text-stone-400'}`}>
                      {formData.message.length}/500 chars (min 15)
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    maxLength={500}
                    value={formData.message}
                    onChange={handleMessageChange}
                    onBlur={() => handleBlur('message')}
                    placeholder="Write your question, suggestion, or market recommendation here (minimum 15 characters)..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all focus:outline-none ${
                      touched.message && errors.message
                        ? 'bg-rose-50/40 border border-rose-400 text-stone-900 focus:ring-2 focus:ring-rose-400'
                        : touched.message && !errors.message && formData.message.length >= 15
                        ? 'bg-emerald-50/20 border border-emerald-500 text-stone-900 focus:ring-2 focus:ring-emerald-500'
                        : 'bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {touched.message && errors.message && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm shadow-soft flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
