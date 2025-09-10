const pool = require('../config/database');

// TODO: SMS ready for future implementation
class Patient {
  static async create(patientData) {
    const { fullName, email, phone, documentPhoto } = patientData;
    
    const phoneMatch = phone.match(/^(\+\d{1,3})(\d+)$/);
    const countryCode = phoneMatch ? phoneMatch[1] : '+1';
    const phoneNumber = phoneMatch ? phoneMatch[2] : phone;
    
    const query = `
      INSERT INTO patients (full_name, email, country_code, phone_number, document_photo, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    
    const values = [fullName, email, countryCode, phoneNumber, documentPhoto];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM patients WHERE email = $1';
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = `
      SELECT 
        id,
        full_name,
        email,
        CONCAT(country_code, phone_number) as phone,
        document_photo,
        created_at
      FROM patients 
      WHERE id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    const query = `
      SELECT 
        id,
        full_name,
        email,
        CONCAT(country_code, phone_number) as phone,
        document_photo,
        created_at
      FROM patients 
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }


  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        country_code VARCHAR(10) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        document_photo VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    try {
      await pool.query(query);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Patient;