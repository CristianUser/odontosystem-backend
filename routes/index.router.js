const express = require('express');
const multer = require('multer');
const router = express.Router();
var upload = multer()

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
  }

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type")
      if (isValid) {
        error = null;
      }
      callback(error,"images"); // path relative to server.js file
    },
    filename: (req, file, callback) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      // Date.now()
      callback(null, name + '-' + req._id + '.' + ext);
    }
  });

const ctrlUser = require('../controllers/user.controller');
const ctrlPatient = require('../controllers/patient.controller');
const ctrlAppointment = require('../controllers/appointment.controller');
const ctrlStatic = require('../controllers/static.controller');
const ctrlTodo = require('../controllers/todo.controller');
const ctrlInvoice = require('../controllers/invoice.controller');
const ctrlTransaction = require('../controllers/transaction.controller');
const ctrlTreatment = require('../controllers/treatment.controller');
const ctrlMedicament = require('../controllers/medicament.controller');
const ctrlPrescription = require('../controllers/prescription.controller');
const ctrlDashboard = require('../controllers/dashboard.controller');

const jwtHelper = require('../config/jwtHelper');

// Patient routes

router.post('/register-patient', jwtHelper.verifyJwtToken, ctrlPatient.register);
router.post('/add-patients', jwtHelper.verifyJwtToken, ctrlPatient.registerPatients);
router.post('/update-patient', jwtHelper.verifyJwtToken, ctrlPatient.updatePatient);
router.get('/get-patient', jwtHelper.verifyJwtToken, ctrlPatient.getPatient);
router.get('/patients', jwtHelper.verifyJwtToken, ctrlPatient.getPatients);
router.get('/get-patients', jwtHelper.verifyJwtToken, ctrlPatient.getPatientsReduced);
router.get('/get-others-patients', jwtHelper.verifyJwtToken, ctrlPatient.getOtherPatients);
router.post('/import-patient', jwtHelper.verifyJwtToken, ctrlPatient.importPatient);
router.post('/delete-patient', jwtHelper.verifyJwtToken, ctrlPatient.removePatient);

// Appointment routes

router.post('/add-event', jwtHelper.verifyJwtToken, ctrlAppointment.add);
router.post('/update-event', jwtHelper.verifyJwtToken, ctrlAppointment.updateAppointment);
router.post('/complete-event', jwtHelper.verifyJwtToken, ctrlAppointment.completeAppointment);
router.get('/get-events', jwtHelper.verifyJwtToken, ctrlAppointment.getAppointments);
router.get('/get-events-in-range', jwtHelper.verifyJwtToken, ctrlAppointment.getAppointmentsInRange);
router.get('/get-patient-appointments', jwtHelper.verifyJwtToken, ctrlAppointment.getPatientAppointments);
router.post('/parse-events', jwtHelper.verifyJwtToken, ctrlAppointment.parseEvents);
router.post('/delete-event', jwtHelper.verifyJwtToken, ctrlAppointment.removeEvent);

// User routes
router.post('/register', ctrlUser.register);
router.get('/get-users', jwtHelper.verifyJwtToken, ctrlUser.getUsers);
router.post('/upload-picture', jwtHelper.verifyJwtToken, multer({storage: storage}).single("image"), ctrlUser.uploadPicture);
router.post('/authenticate', ctrlUser.authenticate);
router.post('/change-password', jwtHelper.verifyJwtToken, ctrlUser.changePassword);
router.post('/save-preferences',jwtHelper.verifyJwtToken, ctrlUser.savePreferences);
router.post('/verify-password',jwtHelper.verifyJwtToken, ctrlUser.verifyPassword);
router.get('/user-profile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);

// Statics routes 
router.post('/add-static', ctrlStatic.add);
router.get('/get-statics', ctrlStatic.getStatics);

// Odontogram routes
router.get('/get-odontogram', jwtHelper.verifyJwtToken, ctrlAppointment.getPatientOdontogram);

// Todo routes
router.get('/get-todolist',jwtHelper.verifyJwtToken, ctrlTodo.get);
router.post('/add-todoitem',jwtHelper.verifyJwtToken, ctrlTodo.add);
router.post('/delete-todoitem',jwtHelper.verifyJwtToken, ctrlTodo.delete);
router.post('/changestatus-todoitem',jwtHelper.verifyJwtToken, ctrlTodo.changeStatus);

// Invoice routes
router.post('/add-invoice',jwtHelper.verifyJwtToken, ctrlInvoice.add);
router.post('/send-invoice',jwtHelper.verifyJwtToken, upload.single("image"), ctrlInvoice.sendInvoice);
router.get('/get-invoices',jwtHelper.verifyJwtToken, ctrlInvoice.getInvoices);
router.get('/cancel-invoice',jwtHelper.verifyJwtToken, ctrlInvoice.cancelInvoice);
router.get('/verify-invoice',jwtHelper.verifyJwtToken, ctrlInvoice.verifyInvoice);
router.get('/get-invoice',jwtHelper.verifyJwtToken, ctrlInvoice.getInvoice);
router.get('/get-patient-balance',jwtHelper.verifyJwtToken, ctrlInvoice.getPatientBalance);

// Transaction routes

router.post('/add-transaction',jwtHelper.verifyJwtToken, ctrlTransaction.addTransaction);
router.get('/cancel-transaction',jwtHelper.verifyJwtToken, ctrlTransaction.cancelTransaction);
router.get('/get-transactions',jwtHelper.verifyJwtToken, ctrlTransaction.getTransactions);
router.get('/get-transaction',jwtHelper.verifyJwtToken, ctrlTransaction.getTransaction);

// Prescription routes

router.post('/add-prescription',jwtHelper.verifyJwtToken, ctrlPrescription.addPrescription);
router.get('/get-prescriptions',jwtHelper.verifyJwtToken, ctrlPrescription.getPrescriptions);
router.get('/get-prescription',jwtHelper.verifyJwtToken, ctrlPrescription.getPrescription);

// Dashboard routes

router.get('/get-tiles', jwtHelper.verifyJwtToken, ctrlDashboard.getTiles);
router.get('/get-info-cards', jwtHelper.verifyJwtToken, ctrlDashboard.getInfoCards);

//Treatment routes
router.post('/add-treatment', jwtHelper.verifyJwtToken, ctrlTreatment.add);
router.get('/get-treatment',jwtHelper.verifyJwtToken, ctrlTreatment.getTreatment);
router.get('/get-treatments',jwtHelper.verifyJwtToken, ctrlTreatment.getTreatments);
router.post('/delete-treatment',jwtHelper.verifyJwtToken, ctrlTreatment.delete);
router.post('/add-treatment-price',jwtHelper.verifyJwtToken, ctrlTreatment.addPrice);
router.post('/update-treatment',jwtHelper.verifyJwtToken, ctrlTreatment.updateTreatment);

//Medicament routes
router.post('/add-medicament', jwtHelper.verifyJwtToken, ctrlMedicament.add);
router.post('/delete-medicament', jwtHelper.verifyJwtToken, ctrlMedicament.delete);
router.get('/get-medicament',jwtHelper.verifyJwtToken, ctrlMedicament.getMedicament);
router.get('/get-medicaments',jwtHelper.verifyJwtToken, ctrlMedicament.getMedicaments);
router.post('/update-medicament',jwtHelper.verifyJwtToken, ctrlMedicament.updateMedicament);

module.exports = router;