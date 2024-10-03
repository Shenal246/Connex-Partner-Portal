import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BecomePartner.css';

const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    mobile: yup.string().required("Mobile is required").matches(/^\d{10}$/, "Mobile must be a 10-digit number"),
    email: yup.string().email("Invalid email").required("Email is required"),
    brNumber: yup.string().required("BR Number is required"),
    vatNumber: yup.string().required("VAT Number is required"),
    address: yup.string().required("Address is required"),
    country: yup.string().required("Country is required"),
    department: yup.string().required("Department is required"),
    nic: yup.string().required("NIC is required"),
    designation: yup.string().required("Designation is required"),
    whatsappBusiness: yup.string().required("Whatsapp Business is required").matches(/^\d{10}$/, "Whatsapp Business must be a 10-digit number"),
    directorName: yup.string().required("Director Name is required"),
    directorId: yup.string().required("Director ID is required"),
    directorEmail: yup.string().email("Invalid email").required("Director Email is required"),
    directorMobile: yup.string().required("Director Mobile is required").matches(/^\d{10}$/, "Director Mobile must be a 10-digit number"),
    brCertificate: yup.mixed().required("BR Certificate is required"),
    vatCertificate: yup.mixed().required("VAT Certificate is required"),
});

const BecomePartner = () => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const handleSelect = (country) => {
        setSelectedCountry(country);
        setValue('country', country, { shouldValidate: true });
    };

    const onSubmit = data => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        axios.post('/api/partner', formData)
            .then(response => {
                alert("Form submitted successfully");
            })
            .catch(error => {
                alert("Error submitting form");
            });
    };

    return (
        <div className="become-partner-container d-flex">

            <div className="container mt-5">
                <div className='row topic'>
                    <h2>Become a Partner</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row contentfields'>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" {...register('firstName')} className="form-control" />
                                {errors.firstName && <p className="text-danger">{errors.firstName.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Mobile</label>
                                <input type="text" {...register('mobile')} className="form-control" />
                                {errors.mobile && <p className="text-danger">{errors.mobile.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>BR Number</label>
                                <input type="text" {...register('brNumber')} className="form-control" />
                                {errors.brNumber && <p className="text-danger">{errors.brNumber.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>VAT Number</label>
                                <input type="text" {...register('vatNumber')} className="form-control" />
                                {errors.vatNumber && <p className="text-danger">{errors.vatNumber.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" {...register('address')} className="form-control" />
                                {errors.address && <p className="text-danger">{errors.address.message}</p>}
                            </div>
                            {/* <div className="form-group">
                            <label>Department</label>
                            <input type="text" {...register('department')} className="form-control" />
                            {errors.department && <p className="text-danger">{errors.department.message}</p>}
                        </div> */}
                            <div className="form-group">
                                <label className='select-country'>Select Country</label>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-secondary dropdown-toggle mt-2" data-bs-toggle="dropdown" aria-expanded="false">
                                        {selectedCountry || 'Select Country'}
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#" onClick={() => handleSelect('Sri Lanka')}>Sri Lanka</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={() => handleSelect('Cambodia')}>Cambodia</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={() => handleSelect('Thailand')}>Thailand</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={() => handleSelect('Maldives')}>Maldives</a></li>
                                    </ul>
                                </div>
                                {errors.country && <p className="text-danger">{errors.country.message}</p>}
                            </div>

                        </div>
                        <div className="col-md-4 clmn2">
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" {...register('lastName')} className="form-control" />
                                {errors.lastName && <p className="text-danger">{errors.lastName.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="text" {...register('email')} className="form-control" />
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Attach BR Certificate</label>
                                <input type="file" {...register('brCertificate')} className="form-control" />
                                {errors.brCertificate && <p className="text-danger">{errors.brCertificate.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Attach VAT Certificate</label>
                                <input type="file" {...register('vatCertificate')} className="form-control" />
                                {errors.vatCertificate && <p className="text-danger">{errors.vatCertificate.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>NIC</label>
                                <input type="text" {...register('nic')} className="form-control" />
                                {errors.nic && <p className="text-danger">{errors.nic.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Designation</label>
                                <input type="text" {...register('designation')} className="form-control" />
                                {errors.designation && <p className="text-danger">{errors.designation.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Whatsapp Business</label>
                                <input type="text" {...register('whatsappBusiness')} className="form-control" />
                                {errors.whatsappBusiness && <p className="text-danger">{errors.whatsappBusiness.message}</p>}
                            </div>
                        </div>

                        <div className='col-md-4 directorDetails'>
                            <div className='row'>
                                <div className="form-group1">
                                    <div className='row topic1'>
                                        <h2>Director Details</h2>
                                    </div>

                                    <label>Director Name</label>
                                    <input type="text" {...register('directorName')} className="form-control" />
                                    {errors.directorName && <p className="text-danger">{errors.directorName.message}</p>}
                                </div>
                                <div className="form-group1">
                                    <label>Director ID</label>
                                    <input type="text" {...register('directorId')} className="form-control" />
                                    {errors.directorId && <p className="text-danger">{errors.directorId.message}</p>}
                                </div>
                                <div className="form-group1">
                                    <label>Director Email</label>
                                    <input type="text" {...register('directorEmail')} className="form-control" />
                                    {errors.directorEmail && <p className="text-danger">{errors.directorEmail.message}</p>}
                                </div>
                                <div className="form-group1">
                                    <label>Director Mobile</label>
                                    <input type="text" {...register('directorMobile')} className="form-control" />
                                    {errors.directorMobile && <p className="text-danger">{errors.directorMobile.message}</p>}
                                </div>
                            </div>

                            <div className='row btton'>
                                <button type="submit" className="btn btn-primary mt-3">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BecomePartner;
