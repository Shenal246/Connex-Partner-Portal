const BACKEND_URL = 'http://192.168.13.249:3001';

const config = {
    becomeapartnerapi: `${BACKEND_URL}/becomePartner`,
    countriesapi: `${BACKEND_URL}/get-countries`,
    loginapi: `${BACKEND_URL}/login`,
    changePasswordApi: `${BACKEND_URL}/change-password`,
    verifytoken: `${BACKEND_URL}/verifytoken_partner`,
    logoutapi: `${BACKEND_URL}/logout`,
    getcategoriesapi: `${BACKEND_URL}/get-categories-srilanka`,
    getvendorsapi: `${BACKEND_URL}/get-vendorswithCategories-srilanka`,
    getproductslistapi: `${BACKEND_URL}/get-productslist`,
    getproductsbyvendorsapi: `${BACKEND_URL}/getproductsbyvendors`,
    getcurrencyunitsapi: `${BACKEND_URL}/get-currencyunits`,
    gettypesapi: `${BACKEND_URL}/get-types`,
    adddealregistrationapi: `${BACKEND_URL}/add-dealregistration`,
    getdealregistrationdetailsapi: `${BACKEND_URL}/get-dealregistrationdetails`,
    getapprovedpercentagesapi: `${BACKEND_URL}/deal-pendingstatus-counts`,
    getwinpercentagesapi: `${BACKEND_URL}/deal-win-counts`,
    getcompletedpercentagesapi: `${BACKEND_URL}/completed-deals-count`,
    getUserDetailsapi: `${BACKEND_URL}/getuserdetailsapi`,
    getvideoinforapi: `${BACKEND_URL}/get-video-info-partners`,
    getallproductsnotrequestedapi: `${BACKEND_URL}/get-AllproductsforPartner-notrequested`,
    requestproductapi: `${BACKEND_URL}/partnerproductrequest`,
    getallproducts_requestedapi: `${BACKEND_URL}/get-AllproductsforPartner-requested`,
    getpromotiondetailsapi: `${BACKEND_URL}/get-promotionsforpartner`,
    addpromotionrequestsapi: `${BACKEND_URL}/add-promotionrequest`,
    getcompanymembersapi: `${BACKEND_URL}/getpartnercompanymembersapi`,
    backendUrl:`${BACKEND_URL}`
};

export default config;
