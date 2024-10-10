import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    CircularProgress,
    Select,
    MenuItem,
    DialogTitle,
    FormControl,
    InputLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import axios from "axios";
import Swal from "sweetalert2";
import { styled } from "@mui/system";
import APIConnection from '../../config';
import * as yup from "yup"; // Import yup
import { useFormik } from "formik"; // Import formik

const themeColor = {
    primary: "#444",
    success: "#4caf50",
    error: "#f44336",
    borderColor: "#777",
    activeStatusColor: "#4caf50",
    inactiveStatusColor: "#f44336",
};

const AddButton = styled(Button)({
    borderRadius: "6px",
    padding: "8px 16px",
    textTransform: "none",
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: themeColor.success,
    position: "absolute",
    right: "16px",
    marginTop: "16px",
    "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
});

const StyledTableHead = styled(TableHead)({
    backgroundColor: themeColor.primary,
    "& th": {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#ffffff",
    },
});

const StyledTableCell = styled(TableCell)({
    borderBottom: `1px solid ${themeColor.borderColor}`,
});

const TitleTypography = styled(Typography)({
    fontWeight: "bold",
    fontSize: "24px",
    color: "#ffffff",
    textAlign: "center",
    padding: "12px 0",
    backgroundColor: themeColor.primary,
    borderRadius: "8px",
    margin: "auto",
    width: "50%",
    marginTop: "16px",
});

const ProfileContainer = styled(Box)({
    position: "relative",
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
});

// const CameraOverlay = styled("label")({
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     color: "#ffffff",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     borderRadius: "50%",
//     padding: "8px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     visibility: "hidden", // Initially hidden
//     transition: "visibility 0.3s ease, opacity 0.3s ease",
//     opacity: 0, // Start with 0 opacity
//     "&:hover": {
//         backgroundColor: "rgba(0, 0, 0, 0.7)",
//     },
// });

// const HiddenInput = styled("input")({
//     display: "none",
// });

const ProfileImage = styled("img")({
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: `2px solid ${themeColor.borderColor}`,
});

const AccessMgt = () => {
    const [members, setMembers] = useState([]);
    const [modules, setModules] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [initialMember, setInitialMember] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const getCompanymembersforaccess = APIConnection.getCompanymembersforaccess;
    const getModulesAPI = APIConnection.getpartnermodules;
    const addMemberAPI = APIConnection.addMemberAPI;


    // Fetch Members
    const fetchMembers = async () => {
        try {
            const response = await axios.get(getCompanymembersforaccess, { withCredentials: true });
            setMembers(response.data);
        } catch (error) {
            console.error("Error loading members:", error);
        }
    };

    // Fetch Modules
    const fetchModules = async () => {
        try {
            const response = await axios.get(getModulesAPI, { withCredentials: true });
            setModules(response.data); // Assuming the API returns a list of modules
        } catch (error) {
            console.error("Error loading modules:", error);
        }
    };

    useEffect(() => {
        fetchMembers();
        fetchModules();
    }, []);

    const handleCloseAddMember = () => {
        formik.resetForm();
        setImagePreview(null);
        setShowAddMemberPopup(false);
    };

    // Yup Validation Schema
    const validationSchema = yup.object({
        name: yup.string().required("Name is required"),
        email: yup.string().email("Enter a valid email").required("Email is required"),
        mobileno: yup.string().required("Mobile number is required"),
        whatsappno: yup.string().required("WhatsApp number is required"),
        designation: yup.string().required("Designation is required"),
        status: yup.string().required("Status is required"),
        modules: yup.array().min(1, "At least one module must be selected"), // At least one module validation
    });

    // const formik = useFormik({
    //     initialValues: { name: '', email: '', mobileno: '', whatsappno: '', designation: '', status: '', modules: [], photoFile: null },
    //     validationSchema,
    //     onSubmit: (values, { setSubmitting, resetForm }) => {
    //         if (showDetailPopup) { // Assume this means we are updating
    //             handleUpdateMember();
    //         } else {
    //             handleAddNewMember(); // This function handles adding a new member
    //         }
    //     },
    // });


    // Formik Configuration
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            mobileno: "",
            whatsappno: "",
            designation: "",
            status: "",
            modules: [],
            photoFile: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsProcessing(true);

            // Creating FormData object and appending values
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("mobileno", values.mobileno);
            formData.append("whatsappno", values.whatsappno);
            formData.append("designation", values.designation);
            formData.append("status", values.status);
            formData.append("modules", JSON.stringify(values.modules)); // Convert array to JSON string
            if (values.photoFile) {
                formData.append("photo", values.photoFile);
            }

            try {
                // Correct Axios Configuration for FormData
                const response = await axios.post(
                    addMemberAPI,
                    formData,
                    {
                        withCredentials: true
                    },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.status === 200) {
                    setShowAddMemberPopup(false);
                    fetchMembers();
                    Swal.fire("Success", "New member added successfully!", "success");
                    resetForm();
                    setImagePreview(null); // Clear image preview after submission
                    fetchMembers();
                } else {
                    setShowAddMemberPopup(false);
                    Swal.fire("Error", response.data.message, "error");
                }
            } catch (error) {
                setShowAddMemberPopup(false);
                Swal.fire("Error", error.response.data.message, "error");
            } finally {
                setIsProcessing(false);
            }
        },
    });


    // Handle Image Upload for Formik
    const handleAddImageUpload = (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            formik.setFieldValue("photoFile", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // // Handle Row Click - Open Details Popup
    // const handleRowClick = (member) => {
    //     setSelectedMember(member);
    //     setInitialMember({ ...member });
    //     setShowDetailPopup(true);
    //     // formik.setValues({ ...member, modules: member.modules && member.modules.map(m => m.id) }); // Assuming modules are an array of objects with an 'id'
    // };

    // Handle Row Click - Open Details Popup
    // const handleRowClick = (member) => {
    //     // Format the modules string to an array of module IDs (assumed to be numbers)
    //     const formattedModules = member.modules ? member.modules.split(',').map((mod) => parseInt(mod.trim())) : [];
    //     setSelectedMember({ ...member, modules: formattedModules });
    //     const memberWithModules = { ...member, modules: formattedModules };
    //     setInitialMember(memberWithModules);
    //     setShowDetailPopup(true);
    // };

    const handleRowClick = (member) => {
        // Format the modules string to an array of module IDs (assumed to be numbers)
        const formattedModules = member.modules ? member.modules.split(',').map((mod) => parseInt(mod.trim())) : [];

        // Set selected member with formatted modules
        const memberWithModules = { ...member, modules: formattedModules };

        console.log("memberWithModules---", memberWithModules);

        setSelectedMember(memberWithModules);  // Set selected member state
        setInitialMember(memberWithModules);   // Set the initial state for comparison

        // Set formik values with selected member data
        formik.setValues({
            id: member.id || '',
            name: member.name || '',
            email: member.email || '',
            mobileno: member.mobileno || '',
            whatsappno: member.whatsappno || '',
            designation: member.designation || '',
            status: member.status || '',
            modules: formattedModules || [],
            photoFile: null,  // Keep the photoFile initially null for new upload
        });

        // Open the detail popup
        setShowDetailPopup(true);
    };


    // Handle checkbox change for member module selection
    // const handleModuleChange = (moduleId) => {
    //     if (selectedMember) {
    //         const updatedModules = selectedMember.modules.includes(moduleId)
    //             ? selectedMember.modules.filter((mod) => mod !== moduleId)
    //             : [...selectedMember.modules, moduleId];

    //         setSelectedMember({ ...selectedMember, modules: updatedModules });
    //     }
    // };

    // Handle checkbox change for member module selection
    const handleModuleChange = (moduleId) => {
        // Use formik's setFieldValue to update the modules array in formik values
        const currentModules = formik.values.modules;
        const updatedModules = currentModules.includes(moduleId)
            ? currentModules.filter((mod) => mod !== moduleId) // Remove the module if already selected
            : [...currentModules, moduleId]; // Add the module if not selected

        // Update formik's modules field
        formik.setFieldValue("modules", updatedModules);

        // Also update the selectedMember state to keep it in sync
        setSelectedMember({ ...selectedMember, modules: updatedModules });
    };


    // Update Member Handler
    const handleUpdateMember = async () => {
        // Check if selectedMember and its id are correctly set
        if (!selectedMember || !selectedMember.id) {
            Swal.fire("Error", "Selected member is invalid or not set.", "error");
            return;
        }

        setIsProcessing(true);

        // Create a FormData object to hold the member details to be updated
        const formData = new FormData();

        // Append formik values to FormData
        Object.keys(formik.values).forEach((key) => {
            if (key === 'photoFile' && formik.values[key]) {
                formData.append("photo", formik.values[key]);
            } else if (key === 'modules') {
                formData.append(key, JSON.stringify(formik.values[key])); // Convert modules array to JSON string
            } else {
                formData.append(key, formik.values[key]);
            }
        });

        // Log the contents of FormData in a structured format for debugging
        console.log("FormData contents:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            // Use axios to make the PUT request for updating member data
            const response = await axios.put(`${APIConnection.updateMember}/${selectedMember.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Correct headers for FormData
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                setShowDetailPopup(false); // Close the detail popup
                fetchMembers(); // Re-fetch members to refresh the list
                Swal.fire("Success", "Member updated successfully!", "success");
            } else {
                Swal.fire("Error", "Failed to update member!", "error");
            }
        } catch (error) {
            console.error("Error updating member:", error);
            Swal.fire("Error", error.message, "error");
        } finally {
            setIsProcessing(false); // End the processing state
        }
    };


    // Handle Image Upload for Details Popup
    const handleDetailImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedMember({ ...selectedMember, photoFile: file });
        }
    };

    // Handle text field changes in the details dialog
    const handleDetailChange = (field, value) => {
        setSelectedMember({ ...selectedMember, [field]: value });
    };

    // Check if any fields have changed to enable the Update button
    const hasMemberChanged = () => {
        // Use JSON.stringify for deep comparison between initialMember and selectedMember
        return JSON.stringify(initialMember) !== JSON.stringify(selectedMember);
    };

    const openAddMemberForm = () => {
        // Reset formik values to initial empty state
        formik.resetForm();
        setImagePreview(null); // Clear the image preview
        setSelectedMember(null); // Set selectedMember to null to prevent edit state
        setShowAddMemberPopup(true); // Open the "Add New Member" popup
    };


    return (
        <Box sx={{ paddingLeft: 2, position: "relative" }}>
            <TitleTypography>Company Access Management</TitleTypography>
            <AddButton startIcon={<AddCircleOutlineIcon />} onClick={() => openAddMemberForm()}>
                Add New Member
            </AddButton>
            <TextField
                label="Search Members"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ marginTop: 2, width: "300px", margin: "16px auto", display: "block" }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {/* Member Table */}
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                <Table>
                    <StyledTableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Mobile No</StyledTableCell>
                            <StyledTableCell>Designation</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>
                        {members
                            .filter((member) => member && member.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((member) => (
                                <TableRow key={member.id} onClick={() => handleRowClick(member)}>
                                    <StyledTableCell>{member.name}</StyledTableCell>
                                    <StyledTableCell>{member.email}</StyledTableCell>
                                    <StyledTableCell>{member.mobileno}</StyledTableCell>
                                    <StyledTableCell>{member.designation}</StyledTableCell>
                                    <StyledTableCell>
                                        {member.status === "Enable" ? (
                                            <span style={{ color: themeColor.activeStatusColor }}>Active</span>
                                        ) : (
                                            <span style={{ color: themeColor.inactiveStatusColor }}>Inactive</span>
                                        )}
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* View/Update Member Details Popup */}
            <Dialog open={showDetailPopup} onClose={() => setShowDetailPopup(false)} maxWidth="md" fullWidth>
                <DialogTitle>Member Details</DialogTitle>
                <DialogContent>
                    {selectedMember && (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sx={{ paddingRight: '16px' }}>
                                    {/* Profile Image with Camera Overlay */}
                                    <ProfileContainer
                                    //     onMouseEnter={(e) => {
                                    //         e.currentTarget.querySelector("label").style.visibility = "visible";
                                    //         e.currentTarget.querySelector("label").style.opacity = 1;
                                    //     }}
                                    //     onMouseLeave={(e) => {
                                    //         e.currentTarget.querySelector("label").style.visibility = "hidden";
                                    //         e.currentTarget.querySelector("label").style.opacity = 0;
                                    //     }}
                                    >
                                        <ProfileImage
                                            src={selectedMember.photo ? `${APIConnection.backendUrl}${selectedMember.photo}` : "https://via.placeholder.com/150"}
                                            alt="Profile"
                                        />
                                        {/* Hidden Input for Image Upload */}
                                        {/* <CameraOverlay htmlFor="upload-photo">
                                            <CameraAltIcon />
                                        </CameraOverlay>
                                        <HiddenInput
                                            id="upload-photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleDetailImageUpload}
                                        /> */}
                                    </ProfileContainer>

                                    <TextField label="Name" fullWidth variant="outlined" sx={{ marginBottom: 2 }} value={selectedMember.name} onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })} />
                                    <TextField label="Email" fullWidth variant="outlined" disabled sx={{ marginBottom: 2 }} value={selectedMember.email} onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })} />
                                    <TextField label="Mobile Number" fullWidth variant="outlined" sx={{ marginBottom: 2 }} value={selectedMember.mobileno} onChange={(e) => setSelectedMember({ ...selectedMember, mobileno: e.target.value })} />
                                    <TextField label="Designation" fullWidth variant="outlined" sx={{ marginBottom: 2 }} value={selectedMember.designation} onChange={(e) => setSelectedMember({ ...selectedMember, designation: e.target.value })} />
                                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select value={selectedMember.status == "Enable" ? 1 : 2} onChange={(e) => setSelectedMember({ ...selectedMember, status: e.target.value })}>
                                            <MenuItem value="1">Enable</MenuItem>
                                            <MenuItem value="2">Disable</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6} sx={{ borderLeft: '1px solid #B2BEB5', paddingLeft: '16px' }}>
                                    <Typography>Privileged Modules:</Typography>
                                    <FormGroup>
                                        {modules.map((module) => (
                                            <FormControlLabel
                                                key={module.id}
                                                control={
                                                    <Checkbox
                                                        checked={selectedMember.modules.includes(module.id)}
                                                        onChange={() => handleModuleChange(module.id)}
                                                    />
                                                }
                                                label={module.name}
                                            />
                                        ))}
                                    </FormGroup>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDetailPopup(false)} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateMember} variant="contained" disabled={!hasMemberChanged() || isProcessing}>
                        {isProcessing ? <CircularProgress size={20} /> : "Update Member"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add New Member Popup */}
            <Dialog open={showAddMemberPopup} onClose={() => setShowAddMemberPopup(false)} maxWidth="md" fullWidth>
                <DialogTitle ><strong>Add New Member</strong></DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sx={{ paddingRight: '16px' }}>
                                <TextField
                                    id="name"
                                    label="Name"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ marginBottom: 2 }}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name} />
                                <TextField
                                    id="email"
                                    label="Email" fullWidth variant="outlined"
                                    sx={{ marginBottom: 2 }}
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email} />
                                <TextField
                                    id="mobileno"
                                    label="Mobile Number" fullWidth variant="outlined"
                                    sx={{ marginBottom: 2 }}
                                    value={formik.values.mobileno}
                                    onChange={formik.handleChange}
                                    error={formik.touched.mobileno && Boolean(formik.errors.mobileno)}
                                    helperText={formik.touched.mobileno && formik.errors.mobileno} />
                                <TextField
                                    id="whatsappno"
                                    label="WhatsApp Number"
                                    fullWidth variant="outlined"
                                    sx={{ marginBottom: 2 }}
                                    value={formik.values.whatsappno}
                                    onChange={formik.handleChange}
                                    error={formik.touched.whatsappno && Boolean(formik.errors.whatsappno)}
                                    helperText={formik.touched.whatsappno && formik.errors.whatsappno} />
                                <TextField
                                    id="designation"
                                    label="Designation"
                                    fullWidth variant="outlined"
                                    sx={{ marginBottom: 2 }}
                                    value={formik.values.designation}
                                    onChange={formik.handleChange}
                                    error={formik.touched.designation && Boolean(formik.errors.designation)}
                                    helperText={formik.touched.designation && formik.errors.designation} />
                                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select label="Status"
                                        id="status"
                                        name="status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        error={formik.touched.status && Boolean(formik.errors.status)}>
                                        <MenuItem value="1">Enable</MenuItem>
                                        <MenuItem value="2">Disable</MenuItem>
                                    </Select>
                                    {formik.touched.status && formik.errors.status && (
                                        <Typography color="error">{formik.errors.status}</Typography>
                                    )}
                                </FormControl>
                                {/* Image Upload Section */}
                                <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                                    <Typography>Upload Profile Picture</Typography>
                                    <input
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        id="photoFile"
                                        name="photoFile"
                                        onChange={handleAddImageUpload}
                                        style={{ margin: "12px 0" }}
                                    />
                                    {imagePreview && (
                                        <ProfileImage src={imagePreview} alt="Profile Preview" />
                                    )}
                                </Box>
                            </Grid>

                            {/* Modules Section */}
                            <Grid item xs={6} sx={{ borderLeft: '1px solid #B2BEB5', paddingLeft: '16px' }}>
                                <Typography sx={{ fontSize: '20px', textAlign: 'center', marginBottom: '10px' }}>Privilege Section</Typography>
                                <Typography>Select Modules:</Typography>
                                <FormGroup>
                                    {modules && modules.map((module) => (
                                        <FormControlLabel
                                            key={module.id}
                                            control={
                                                <Checkbox
                                                    checked={formik.values.modules && formik.values.modules.includes(module.id)}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        const newModules = formik.values.modules.includes(value)
                                                            ? formik.values.modules.filter((mod) => mod !== value)
                                                            : [...formik.values.modules, value];
                                                        formik.setFieldValue("modules", newModules);
                                                    }}
                                                    value={module.id}

                                                />
                                            }
                                            label={module.name}

                                        />
                                    ))}
                                </FormGroup>
                                {formik.touched.modules && formik.errors.modules && (
                                    <Typography color="error">{formik.errors.modules}</Typography>
                                )}
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <Button onClick={() => setShowAddMemberPopup(false)} color="error">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={isProcessing}>
                                {isProcessing ? <CircularProgress size={20} /> : "Add Member"}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>


            </Dialog>
        </Box>
    );
};

export default AccessMgt;
