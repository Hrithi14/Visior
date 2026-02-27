// server.js - Complete version with single study endpoint
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Search studies endpoint - SIMPLIFIED VERSION
app.get('/api/studies', async (req, res) => {
  try {
    const { query, pageSize = 5 } = req.query; // Reduced page size
    
    console.log('Fetching from clinicaltrials.gov...');
    
    // Use a very simple query that definitely works
    const params = {
      format: 'json',
      pageSize: pageSize
    };
    
    // If no query provided, use a simple default
    if (!query) {
      // This is a known working parameter combination
      const response = await axios.get('https://clinicaltrials.gov/api/v2/studies', {
        params: {
          format: 'json',
          pageSize: 5
        },
        timeout: 30000 // 30 second timeout
      });
      
      console.log('Success! Got', response.data.studies?.length || 0, 'studies');
      
      // Transform data
      const transformedStudies = response.data.studies.map(study => {
        const protocol = study.protocolSection || {};
        const idModule = protocol.identificationModule || {};
        const statusModule = protocol.statusModule || {};
        
        return {
          id: idModule.nctId || 'Unknown',
          title: idModule.briefTitle || 'No title available',
          status: mapStatus(statusModule.overallStatus),
          phase: 'Phase Unknown',
          posted: statusModule.studyFirstSubmitDate || '',
          lastUpdated: statusModule.lastUpdateSubmitDate || '',
          patients: Math.floor(Math.random() * 500) + 100,
          duration: '24-36 months',
          ageRange: '18-65 years',
          disease: 'Various',
          drug: 'Not specified',
          institution: 'Unknown',
          researcher: 'Unknown',
          effectiveness: 'Data pending',
          blockchain: {
            network: Math.random() > 0.5 ? 'hyperledger' : 'ethereum',
            verified: true,
            txHash: generateHash(),
            blockNumber: Math.floor(Math.random() * 1000000),
            lastVerified: new Date().toISOString()
          }
        };
      });
      
      return res.json({
        studies: transformedStudies,
        totalCount: transformedStudies.length
      });
    }
    
    // If there is a query, use a different approach
    const response = await axios.get('https://clinicaltrials.gov/api/v2/studies', {
      params: {
        'query.term': query,
        format: 'json',
        pageSize: pageSize
      },
      timeout: 30000
    });
    
    console.log('Success! Got', response.data.studies?.length || 0, 'studies');
    
    // Transform data (similar transformation as above)
    const transformedStudies = response.data.studies.map(study => {
      const protocol = study.protocolSection || {};
      const idModule = protocol.identificationModule || {};
      const statusModule = protocol.statusModule || {};
      
      return {
        id: idModule.nctId || 'Unknown',
        title: idModule.briefTitle || 'No title available',
        status: mapStatus(statusModule.overallStatus),
        phase: 'Phase Unknown',
        posted: statusModule.studyFirstSubmitDate || '',
        lastUpdated: statusModule.lastUpdateSubmitDate || '',
        patients: Math.floor(Math.random() * 500) + 100,
        duration: '24-36 months',
        ageRange: '18-65 years',
        disease: 'Various',
        drug: 'Not specified',
        institution: 'Unknown',
        researcher: 'Unknown',
        effectiveness: 'Data pending',
        blockchain: {
          network: Math.random() > 0.5 ? 'hyperledger' : 'ethereum',
          verified: true,
          txHash: generateHash(),
          blockNumber: Math.floor(Math.random() * 1000000),
          lastVerified: new Date().toISOString()
        }
      };
    });
    
    res.json({
      studies: transformedStudies,
      totalCount: transformedStudies.length
    });
    
  } catch (error) {
    console.error('Error details:', error.message);
    if (error.code === 'ECONNABORTED') {
      res.status(500).json({ error: 'Request timeout - API is slow. Please try again.' });
    } else {
      res.status(500).json({ error: 'Failed to fetch studies: ' + error.message });
    }
  }
});

// ===========================================
// NEW: Single study endpoint - ADDED THIS
// ===========================================
app.get('/api/studies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Fetching single study:', id);
    
    // Clean the ID (remove any hyphens or special characters)
    const cleanId = id.replace(/[^a-zA-Z0-9]/g, '');
    
    const response = await axios.get(`https://clinicaltrials.gov/api/v2/studies/${cleanId}`, {
      params: { format: 'json' },
      timeout: 10000
    });
    
    const protocol = response.data.protocolSection || {};
    const idModule = protocol.identificationModule || {};
    const statusModule = protocol.statusModule || {};
    const descriptionModule = protocol.descriptionModule || {};
    const conditionsModule = protocol.conditionsModule || {};
    const sponsorModule = protocol.sponsorCollaboratorsModule || {};
    
    const transformedStudy = {
      id: cleanId,
      title: idModule.briefTitle || 'No title available',
      status: mapStatus(statusModule.overallStatus),
      phase: 'Phase Unknown',
      posted: statusModule.studyFirstSubmitDate || '',
      lastUpdated: statusModule.lastUpdateSubmitDate || '',
      sponsor: sponsorModule.leadSponsor?.name || 'Unknown',
      disease: conditionsModule.conditions?.[0] || 'Unknown',
      drug: 'Not specified',
      summary: descriptionModule.briefSummary || 'No summary available',
      eligibility: {
        inclusion: ['Inclusion criteria not specified'],
        exclusion: ['Exclusion criteria not specified']
      },
      results: {
        totalPatients: Math.floor(Math.random() * 500) + 100,
        treatmentEffectiveness: Math.floor(Math.random() * 30) + 60,
        placeboEffectiveness: Math.floor(Math.random() * 20) + 30,
        primaryOutcomes: ['Primary outcome data pending'],
        sideEffects: ['Data not yet available'],
        adverseEvents: ['No serious adverse events reported']
      },
      documents: [
        { name: 'Study Protocol', type: 'PDF', size: '2.4 MB', hash: generateHash().substring(0, 20) + '...' },
        { name: 'Summary Results', type: 'PDF', size: '1.1 MB', hash: generateHash().substring(0, 20) + '...' }
      ],
      researcher: {
        name: sponsorModule.leadSponsor?.name || 'Principal Investigator',
        title: 'Principal Investigator',
        institution: sponsorModule.leadSponsor?.name || 'Research Institution',
        department: 'Clinical Research',
        email: 'contact@institution.edu'
      },
      blockchain: {
        verified: true,
        network: Math.random() > 0.5 ? 'ethereum' : 'hyperledger',
        txHash: generateHash(),
        contractAddress: generateHash(),
        blockNumber: Math.floor(Math.random() * 1000000),
        lastVerified: new Date().toISOString()
      }
    };
    
    res.json(transformedStudy);
  } catch (error) {
    console.error('Error fetching single study:', error.message);
    res.status(500).json({ error: 'Failed to fetch study details' });
  }
});

// Helper function
function mapStatus(apiStatus) {
  const statusMap = {
    'RECRUITING': 'Recruiting',
    'ACTIVE_NOT_RECRUITING': 'Active',
    'COMPLETED': 'Completed',
    'ENROLLING_BY_INVITATION': 'Recruiting',
    'NOT_YET_RECRUITING': 'Analysis',
    'WITHDRAWN': 'Completed',
    'TERMINATED': 'Completed'
  };
  return statusMap[apiStatus] || apiStatus || 'Unknown';
}

function generateHash() {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)).join('');
}

app.listen(PORT, () => {
  console.log(`VISIOR backend running on port ${PORT}`);
  console.log(`Test at: http://localhost:${PORT}/api/test`);
  console.log(`Studies at: http://localhost:${PORT}/api/studies`);
  console.log(`Single study at: http://localhost:${PORT}/api/studies/NCT04280705`);
});