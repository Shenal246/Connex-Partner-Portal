import React, { useState, useEffect } from 'react';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Grid,
  Autocomplete,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import './BecomePartner.css';
import BecomeComLogo from '../img/ConnexIT.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import APIConnection from '../../config';

// Step titles
const steps = ['Personal Information', 'Company Information', 'Director Information'];

// Validation schemas for each step
const validationSchema = [
  Yup.object({
    personalName: Yup.string().required('Name is required'),
    personalEmail: Yup.string().email('Invalid email').required('Email is required'),
    designation: Yup.string().required('Designation is required'),
    personalMobile: Yup.string().required('Mobile number is required').matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
    department: Yup.string().required('Department is required'),
  }),
  Yup.object({
    companyName: Yup.string().required('Company name is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    websiteLink: Yup.string().url('Invalid URL').required('Website link is required'),
    companyEmail: Yup.string().email('Invalid email').required('Email is required'),
    telephone: Yup.string().required('Telephone number is required').matches(/^\d{10}$/, 'Telephone number must be 10 digits'),
    country: Yup.object().shape({
      id: Yup.number().required('Country is required'),
      name: Yup.string().required('Country is required')
    }).nullable(),
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

// Component to render form fields
const FormField = ({ name, label, type = 'text' }) => {
  const { control } = useFormContext();
  return (
    <Grid item xs={12} md={6}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={label}
            type={type}
            variant="outlined"
            fullWidth
            margin="dense"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Grid>
  );
};

// Component to render a file upload field
const FileUploadField = ({ handleFileChange, fileName, label, name }) => (
  <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
    <Button
      variant="contained"
      component="label"
      startIcon={<UploadFileIcon />}
      sx={{ mt: 1, mr: 2 }}
    >
      Upload {label}
      <input type="file" hidden onChange={(event) => handleFileChange(event, name)} />
    </Button>
    {fileName && (
      <Typography variant="body2" sx={{ mt: 1 }}>
        {fileName}
      </Typography>
    )}
  </Grid>
);

// Component for personal information form
const PersonalInformation = () => (
  <Grid container spacing={2}>
    <FormField name="personalName" label="Name" />
    <FormField name="personalEmail" label="Email" />
    <FormField name="designation" label="Designation" />
    <FormField name="personalMobile" label="Mobile Number" />
    <FormField name="department" label="Department" />
  </Grid>
);

// Component for company information form
const CompanyInformation = ({ handleFileChange, brFileName, vatFileName, countries }) => {
  const { control } = useFormContext();
  return (
    <Grid container spacing={2}>
      <FormField name="companyName" label="Company Name" />
      <FormField name="address" label="Address" />
      <FormField name="city" label="City" />
      <FormField name="websiteLink" label="Website Link" />
      <FormField name="companyEmail" label="Company Email" />
      <FormField name="telephone" label="Telephone Number" />
      <Grid item xs={12} md={6}>
        <Controller
          name="country"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              options={countries}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  variant="outlined"
                  margin="dense"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
              onChange={(_, data) => field.onChange(data || { id: '', name: '' })} // Handle selection change
              value={field.value || { id: '', name: '' }} // Set initial value
            />
          )}
        />
      </Grid>
      <FormField name="whatsappBusiness" label="WhatsApp Business Number" />
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormField name="brNumber" label="BR Number" />
        <FileUploadField handleFileChange={handleFileChange} fileName={brFileName}  label={<>BR Certificate (<strong style={{ color: 'red' }}>Only PDF</strong>)</>}  name="brFile" />
      </Grid>
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormField name="vatNumber" label="VAT Number" />
        <FileUploadField handleFileChange={handleFileChange} fileName={vatFileName} label={<>VAT Certificate (<strong style={{ color: 'red' }}>Only PDF</strong>)</>}  name="vatFile" />
      </Grid>
    </Grid>
  );
};

// Component for director information form
const DirectorInformation = ({ handleFileChange, forn20FileName }) => (
  <Grid container spacing={2}>
    <FormField name="directorName" label="Director Name" />
    <FormField name="directorEmail" label="Director Email" />
    <FormField name="directorMobile" label="Director Mobile Number" />
    <FormField name="directorWhatsapp" label="Director WhatsApp Number" />
    <Grid item xs={12}>
      <Typography variant="body2" sx={{ mt: 1, mb: 1, color: 'red' }}>
        If FORM 20 is not submitted, validation may take 2 working days.
      </Typography>
      <FileUploadField handleFileChange={handleFileChange} fileName={forn20FileName} label={<>FORM 20 (<strong style={{ color: 'red' }}>Only PDF</strong>)</>} name="forn20" />
    </Grid>
  </Grid>
);

// Main component for the Become a Partner page
const BecomeAPartner = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [brCertificate, setBrCertificate] = useState(null);
  const [vatCertificate, setVatCertificate] = useState(null);
  const [brFileName, setBrFileName] = useState('');
  const [vatFileName, setVatFileName] = useState('');
  const [forn20File, setForn20File] = useState(null);
  const [forn20FileName, setForn20FileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  const becomeapartnerapi = APIConnection.becomeapartnerapi;
  const countriesapi = APIConnection.countriesapi;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(countriesapi);
        console.log(response);
           
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, [countriesapi]);

  const methods = useForm({
    resolver: yupResolver(validationSchema[activeStep]),
    mode: 'onBlur',
    defaultValues: {
      personalName: '',
      personalEmail: '',
      designation: '',
      personalMobile: '',
      department: '',
      companyName: '',
      address: '',
      city: '',
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
      directorWhatsapp: '',
    },
  });

  const { trigger, setError, reset } = methods;

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (type === 'brFile') {
      setBrCertificate(file);
      setBrFileName(file ? file.name : '');
    } else if (type === 'vatFile') {
      setVatCertificate(file);
      setVatFileName(file ? file.name : '');
    } else if (type === 'forn20') {
      setForn20File(file);
      setForn20FileName(file ? file.name : '');
    }
  };

  const handleNext = async () => {
    const valid = await trigger();
    if (valid) {
      if (activeStep === 1 && (!brCertificate || !vatCertificate)) {
        if (!brCertificate) setError('brFile', { type: 'manual', message: 'BR certificate is required' });
        if (!vatCertificate) setError('vatFile', { type: 'manual', message: 'VAT certificate is required' });
        return;
      }

      if (activeStep === steps.length - 1) {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('personalName', methods.getValues('personalName'));
        formData.append('personalEmail', methods.getValues('personalEmail'));
        formData.append('designation', methods.getValues('designation'));
        formData.append('personalMobile', methods.getValues('personalMobile'));
        formData.append('department', methods.getValues('department'));
        formData.append('companyName', methods.getValues('companyName'));
        formData.append('address', methods.getValues('address'));
        formData.append('city', methods.getValues('city'));
        formData.append('websiteLink', methods.getValues('websiteLink'));
        formData.append('companyEmail', methods.getValues('companyEmail'));
        formData.append('telephone', methods.getValues('telephone'));
        formData.append('country', methods.getValues('country').id); // send country ID
        formData.append('whatsappBusiness', methods.getValues('whatsappBusiness'));
        formData.append('brNumber', methods.getValues('brNumber'));
        formData.append('vatNumber', methods.getValues('vatNumber'));
        formData.append('directorName', methods.getValues('directorName'));
        formData.append('directorEmail', methods.getValues('directorEmail'));
        formData.append('directorMobile', methods.getValues('directorMobile'));
        formData.append('directorWhatsapp', methods.getValues('directorWhatsapp'));

        if (brCertificate) formData.append('brFile', brCertificate);
        if (vatCertificate) formData.append('vatFile', vatCertificate);
        if (forn20File) formData.append('forn20', forn20File);

        try {
          const response = await axios.post(becomeapartnerapi, formData);
          if (response.status === 201) {
            console.log('Form submitted successfully');
            Swal.fire({
              title: "Successfully Sent",
              text: "Form submitted successfully",
              icon: "success"
            });
            reset(); // Reset the form fields
            navigate('/'); // Redirect to the login page
          }
          if (response.status === 210) {
            Swal.fire({
              title: "Duplicate BR No",
              text: "A partner with this BR number already exists.",
              icon: "error"
            });
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          Swal.fire({
            title: "Submission Error",
            text: error.response.data.message,
            icon: "error"
          });
        } finally {
          setIsSubmitting(false);
        }
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
        return <CompanyInformation handleFileChange={handleFileChange} brFileName={brFileName} vatFileName={vatFileName} countries={countries} />;
      case 2:
        return <DirectorInformation handleFileChange={handleFileChange} forn20FileName={forn20FileName} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Container>
        <img src={BecomeComLogo} alt="comLogo" className="BecomePageLogo" />

        <Box sx={{ width: '100%', marginTop: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Become a Partner
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <FormProvider {...methods}>
            <Box sx={{ p: 3 }}>
              {renderStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                  Back
                </Button>
                <Button onClick={handleNext} variant="contained" color="primary">
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
              {isSubmitting && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
          </FormProvider>
        </Box>
      </Container>
    </>
  );
};

export default BecomeAPartner;