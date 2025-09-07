import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

// Seed initial settings if they don't exist
settingSchema.statics.seedInitialSettings = async function() {
  const settingsToSeed = [
    { key: 'appName', value: 'CLBP Predictive System' },
    { key: 'emergencyContact', value: { name: 'Default Emergency Contact', phone: '123-456-7890' } },
  ];

  for (const setting of settingsToSeed) {
    const existing = await this.findOne({ key: setting.key });
    if (!existing) {
      await this.create(setting);
      console.log(`Seeded setting: ${setting.key}`);
    }
  }
};

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
