import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { submitContact } from '../../services/contactService';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const ContactPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await submitContact(data);
      if (res.success) {
        toast.success('Your message has been submitted successfully.');
        reset();
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 text-sm">Have a question or feedback? Drop us a message.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" placeholder="Your name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
          <Input label="Email" type="email" placeholder="Your email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
          <Input label="Mobile Number" placeholder="Your mobile number" error={errors.mobile?.message} {...register('mobile')} />
          <Select label="Category" {...register('category')}>
            <option value="General">General</option>
            <option value="Registration">Registration</option>
            <option value="Login">Login</option>
            <option value="Verification">Verification</option>
            <option value="Voting">Voting</option>
            <option value="Technical">Technical</option>
          </Select>
          <Input label="Subject" placeholder="Subject" error={errors.subject?.message} {...register('subject', { required: 'Subject is required' })} />
          <TextArea label="Message" placeholder="Your message" error={errors.message?.message} {...register('message', { required: 'Message is required' })} />
          
          <Button type="submit" loading={loading} className="w-full">
            Submit Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
