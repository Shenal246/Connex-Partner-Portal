import React, { useState, useEffect } from 'react';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, TextField, Button, Grid, MenuItem, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import APIConnect from '../../config';

const steps = ['Opportunity', 'Product Section', 'Remarks'];

const validationSchema = [
  Yup.object().shape({
    projectName: Yup.string().required('Project Name is required'),
    companyName: Yup.string().required('Company Name is required'),
    contactNumber: Yup.string()
      .required('Contact Number is required')
      .matches(/^\d{10}$/, 'Contact Number must be 10 digits'),
    designation: Yup.string().required('Designation is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  }),
  Yup.object().shape({
    vendor: Yup.string().required('Vendor is required'),
    selectProducts: Yup.string().required('Select Products is required'),
    closeTimeline: Yup.date().required('Close Timeline is required'),
    budgetValue: Yup.number()
      .typeError('Budget Value must be a number')
      .required('Budget Value is required'),
    budgetCurrency: Yup.string().required('Currency is required'),
    competitor: Yup.string().required('Competitor is required'),
    type: Yup.string().required('Type is required'),
  }),
  Yup.object().shape({
    specialRequest: Yup.string(),
  }),
];

const FormField = ({ name, label, type = 'text', options = [], multiline = false, rows = 1, onChange, ...rest }) => {
  const { control, setValue } = useFormContext();
  return (
    <Grid item xs={12} md={6}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select={type === 'select'}
            label={label}
            type={type}
            variant="outlined"
            fullWidth
            margin="dense"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            multiline={multiline}
            rows={rows}
            sx={{ height: multiline ? 'auto' : 45 }}
            onChange={(e) => {
              field.onChange(e);
              if (onChange) {
                onChange(e);
              }
            }}
            {...rest}
          >
            {type === 'select' && options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Grid>
  );
};

const Opportunity = () => (
  <Grid container spacing={2}>
    <FormField name="projectName" label="Project Name" />
    <FormField name="companyName" label="Company Name" />
    <FormField name="contactNumber" label="Contact Number" />
    <FormField name="designation" label="Designation" />
    <FormField name="email" label="Email" />
  </Grid>
);

const ProductSection = ({ vendorOptions, productOptions, currencyOptions, typeOptions, onVendorChange }) => {
  return (
    <Grid container spacing={2}>
      <FormField name="vendor" label="Vendor" type="select" options={vendorOptions} onChange={onVendorChange} />
      <FormField name="selectProducts" label="Select Products" type="select" options={productOptions} />

      <FormField name="closeTimeline" label="Close Timeline" type="date" InputLabelProps={{ shrink: true }} />
      <FormField name="competitor" label="Competitor" />
      <FormField name="type" label="Type" type="select" options={typeOptions} />
      <FormField name="budgetCurrency" label="Currency" type="select" options={currencyOptions} />
      <FormField name="budgetValue" label="Budget Value" type="number" />
    </Grid>
  );
};

const Remarks = () => (
  <Grid container spacing={2}>
    <FormField name="specialRequest" label="Special Request" multiline rows={6} />
  </Grid>
);

function DealRegistrationForm({ handleCloseModal, refreshTable }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  const getcurrencyunitsapi = APIConnect.getcurrencyunitsapi;
  const gettypesapi = APIConnect.gettypesapi;
  const getvendorsapi = APIConnect.getvendorsapi;
  const getproductsbyvendorapi = APIConnect.getproductsbyvendorsapi; 
  const adddealregistrationapi = APIConnect.adddealregistrationapi;

  useEffect(() => {
    const fetchCurrencyUnits = async () => {
      try {
        const response = await axios.get(getcurrencyunitsapi, { withCredentials: true });
        const options = response.data.map((currency) => ({ value: currency.id, label: currency.name }));
        setCurrencyOptions(options);
      } catch (error) {
        console.error('Failed to fetch currency units:', error);
      }
    };

    const fetchTypeOptions = async () => {
      try {
        const response = await axios.get(gettypesapi, { withCredentials: true });
        const options = response.data.map((type) => ({ value: type.id, label: type.name }));
        setTypeOptions(options);
      } catch (error) {
        console.error('Failed to fetch type options:', error);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await axios.get(getvendorsapi, { withCredentials: true });
        const options = response.data.map((vendor) => ({ value: vendor.id, label: vendor.name }));
        setVendorOptions(options);
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
      }
    };

    fetchCurrencyUnits();
    fetchTypeOptions();
    fetchVendors();
  }, [getcurrencyunitsapi, gettypesapi, getvendorsapi]);

  const handleVendorChange = async (e) => {
    const vendorId = e.target.value;
    try {
      const response = await axios.get(`${getproductsbyvendorapi}/${vendorId}`, { withCredentials: true });
      console.log(response); // Debugging: check if response is correct
      
      const options = response.data.rows.map((product) => ({ value: product.id, label: product.name }));
      setProductOptions(options); // Ensure this is called correctly
  
      // If setProductOptions is not updating, log it
      console.log("Product options set to:", options);
    } catch (error) {
      console.error('Failed to fetch products by vendor:', error);
    }
  };
  

  const methods = useForm({
    resolver: yupResolver(validationSchema[activeStep]),
    mode: 'onBlur',
    defaultValues: {
      projectName: '',
      companyName: '',
      contactNumber: '',
      designation: '',
      email: '',
      vendor: '',
      selectProducts: '',
      closeTimeline: null,
      budgetValue: '',
      budgetCurrency: '',
      competitor: '',
      type: '',
      specialRequest: '',
    },
  });

  const { trigger, handleSubmit } = methods;

  const handleNext = async () => {
    const valid = await trigger();
    if (valid) {
      if (activeStep === steps.length - 1) {
        setIsSubmitting(true);
        handleSubmit(onSubmit)();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(adddealregistrationapi, data, { withCredentials: true });
      Swal.fire({
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      });
      methods.reset();
      handleCloseModal();
      refreshTable();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error submitting form',
        showConfirmButton: true,
        timer: 1500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <Opportunity />;
      case 1:
        return (
          <ProductSection
            vendorOptions={vendorOptions}
            productOptions={productOptions}
            currencyOptions={currencyOptions}
            typeOptions={typeOptions}
            onVendorChange={handleVendorChange}
          />
        );
      case 2:
        return <Remarks />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <FormProvider {...methods}>
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
      </FormProvider>
    </Box>
  );
}

export default DealRegistrationForm;