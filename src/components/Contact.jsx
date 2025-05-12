
import React from 'react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import ContactSocial from './ContactSocial';

const Contact = () => {
  return (
    <section id="contact" className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title font-playfair text-2xl font-bold text-lilmod-navy mb-10">NOUS CONTACTER</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactForm />
          
          <div className="flex flex-col gap-6">
            <ContactInfo />
            <ContactSocial />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
