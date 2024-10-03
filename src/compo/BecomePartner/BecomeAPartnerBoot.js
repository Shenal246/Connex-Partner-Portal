import React, { useState } from 'react';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BecomePartner.css';

const steps = ['Personal Information', 'Company Information', 'Director Information'];

const validationSchema = [
  Yup.object({
    personalName: Yup.string().required('Name is required'),
    personalEmail: Yup.string().email('Invalid email').required('Email is required'),
    designation: Yup.string().required('Designation is required'),
    personalMobile: Yup.string().required('Mobile number is required').matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
  }),
  Yup.object({
    companyName: Yup.string().required('Company name is required'),
    address: Yup.string().required('Address is required'),
    websiteLink: Yup.string().url('Invalid URL').required('Website link is required'),
    companyEmail: Yup.string().email('Invalid email').required('Email is required'),
    telephone: Yup.string().required('Telephone number is required').matches(/^\d{10}$/, 'Telephone number must be 10 digits'),
    country: Yup.string().required('Country is required'),
    whatsappBusiness: Yup.string().required('WhatsApp number is required').matches(/^\d{10}$/, 'WhatsApp number must be 10 digits'),
    brNumber: Yup.string().required('BR number is required'),
    vatNumber: Yup.string().required('VAT number is required'),
  }),
  Yup.object({
    directorName: Yup.string().required('Name is required'),
    directorEmail: Yup.string().email('Invalid email').required('Email is required'),
    directorMobile: Yup.string().required('Mobile number is required').matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
    directorWhatsapp: Yup.string().required('WhatsApp number is required').matches(/^\d{10}$/, 'WhatsApp number must be 10 digits'),
  }),
];

const FormField = ({ name, label, type = "text" }) => {
  const { control } = useFormContext();
  return (
    <Col xs={12} md={6}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
              {...field}
              type={type}
              isInvalid={!!fieldState.error}
            />
            <Form.Control.Feedback type="invalid">
              {fieldState.error?.message}
            </Form.Control.Feedback>
          </Form.Group>
        )}
      />
    </Col>
  );
};

const FileUploadField = ({ handleFileChange, fileName, label, name }) => (
  <Col xs={12} md={6} className="d-flex align-items-center">
    <Form.Group className="mb-3 d-flex flex-column">
      <Form.Label className="d-flex align-items-center">{label}</Form.Label>
      <Button variant="primary" as="label" className="mr-2">
        Upload {label}
        <input type="file" hidden onChange={(event) => handleFileChange(event, name)} />
      </Button>
      {fileName && <small className="mt-2">{fileName}</small>}
    </Form.Group>
  </Col>
);

const PersonalInformation = () => (
  <Row>
    <FormField name="personalName" label="Name" />
    <FormField name="personalEmail" label="Email" />
    <FormField name="designation" label="Designation" />
    <FormField name="personalMobile" label="Mobile Number" />
  </Row>
);

const CompanyInformation = ({ handleFileChange, brFileName, vatFileName }) => (
  <Row>
    <FormField name="companyName" label="Company Name" />
    <FormField name="address" label="Address" />
    <FormField name="websiteLink" label="Website Link" />
    <FormField name="companyEmail" label="Company Email" />
    <FormField name="telephone" label="Telephone Number" />
    <FormField name="country" label="Country" />
    <FormField name="whatsappBusiness" label="WhatsApp Business Number" />
    <Col xs={12} md={6}>
      <Row>
        <FormField name="brNumber" label="BR Number" />
        <FileUploadField handleFileChange={handleFileChange} fileName={brFileName} label="BR Certificate" name="brNumber" />
      </Row>
    </Col>
    <Col xs={12} md={6}>
      <Row>
        <FormField name="vatNumber" label="VAT Number" />
        <FileUploadField handleFileChange={handleFileChange} fileName={vatFileName} label="VAT Certificate" name="vatNumber" />
      </Row>
    </Col>
  </Row>
);

const DirectorInformation = () => (
  <Row>
    <FormField name="directorName" label="Director Name" />
    <FormField name="directorEmail" label="Director Email" />
    <FormField name="directorMobile" label="Director Mobile Number" />
    <FormField name="directorWhatsapp" label="Director WhatsApp Number" />
  </Row>
);

const BecomeAPartner = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [brCertificate, setBrCertificate] = useState(null);
  const [vatCertificate, setVatCertificate] = useState(null);
  const [brFileName, setBrFileName] = useState('');
  const [vatFileName, setVatFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchema[activeStep]),
    mode: 'onBlur',
    defaultValues: {
      personalName: '',
      personalEmail: '',
      designation: '',
      personalMobile: '',
      companyName: '',
      address: '',
      websiteLink: '',
      companyEmail: '',
      telephone: '',
      country: '',
      whatsappBusiness: '',
      brNumber: '',
      vatNumber: '',
      directorName: '',
      directorEmail: '',
      directorMobile: '',
      directorWhatsapp: ''
    }
  });

  const { trigger, handleSubmit } = methods;

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (type === 'brNumber') {
      setBrCertificate(file);
      setBrFileName(file ? file.name : '');
    } else if (type === 'vatNumber') {
      setVatCertificate(file);
      setVatFileName(file ? file.name : '');
    }
  };

  const handleNext = async () => {
    const valid = await trigger();
    if (valid) {
      if (activeStep === steps.length - 1) {
        setIsSubmitting(true);
        // Submit logic here
        console.log({ brCertificate, vatCertificate });
        // Simulate submission delay
        setTimeout(() => {
          setIsSubmitting(false);
          // Add any additional logic needed after submission
        }, 2000);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <PersonalInformation />;
      case 1:
        return <CompanyInformation handleFileChange={handleFileChange} brFileName={brFileName} vatFileName={vatFileName} />;
      case 2:
        return <DirectorInformation />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <div className="my-4">
        <h1>Become a Partner</h1>
        <ul className="list-inline">
          {steps.map((label, index) => (
            <li key={label} className={`list-inline-item ${activeStep === index ? 'active' : ''}`}>
              <Button variant="link" disabled>{label}</Button>
            </li>
          ))}
        </ul>
        <FormProvider {...methods}>
          <Form>
            {renderStepContent(activeStep)}
            <div className="d-flex justify-content-between mt-3">
              <Button disabled={activeStep === 0} onClick={handleBack} variant="secondary">Back</Button>
              <Button onClick={handleNext} variant="primary">
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
            {isSubmitting && (
              <div className="d-flex justify-content-center mt-3">
                <Spinner animation="border" />
              </div>
            )}
          </Form>
        </FormProvider>
      </div>
    </Container>
  );
};

export default BecomeAPartner;
