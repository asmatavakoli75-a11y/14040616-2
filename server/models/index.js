import sequelize from '../config/db.js';
import User from './User.js';
import Questionnaire from './Questionnaire.js';
import Question from './Question.js';
import Assessment from './Assessment.js';
import Note from './Note.js';
import Setting from './Setting.js';
import PredictionModel from './PredictionModel.js';

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Questionnaire = Questionnaire;
db.Question = Question;
db.Assessment = Assessment;
db.Note = Note;
db.Setting = Setting;
db.PredictionModel = PredictionModel;

// Define associations here

// User -> Assessment (One-to-Many)
// A patient (User) can have multiple assessments.
db.User.hasMany(db.Assessment, { foreignKey: 'patientId', as: 'assessments' });
db.Assessment.belongsTo(db.User, { foreignKey: 'patientId', as: 'patient' });

// Questionnaire -> Assessment (One-to-Many)
// A questionnaire can be used in multiple assessments.
db.Questionnaire.hasMany(db.Assessment, { foreignKey: 'questionnaireId', as: 'assessments' });
db.Assessment.belongsTo(db.Questionnaire, { foreignKey: 'questionnaireId', as: 'questionnaire' });

// User -> Note (One-to-Many, with two relations)
// A note has one author and is about one patient.
db.Note.belongsTo(db.User, { as: 'patient', foreignKey: 'patientId' });
db.Note.belongsTo(db.User, { as: 'author', foreignKey: 'authorId' });
// A user can have notes written about them and can be the author of notes.
db.User.hasMany(db.Note, { as: 'notesAbout', foreignKey: 'patientId' });
db.User.hasMany(db.Note, { as: 'authoredNotes', foreignKey: 'authorId' });

// Questionnaire <-> Question (Many-to-Many)
// A questionnaire can have many questions, and a question can be in many questionnaires.
const QuestionnaireQuestion = sequelize.define('QuestionnaireQuestion', {}, { timestamps: false });
db.Questionnaire.belongsToMany(db.Question, { through: QuestionnaireQuestion });
db.Question.belongsToMany(db.Questionnaire, { through: QuestionnaireQuestion });


export default db;
