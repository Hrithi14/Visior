#!/bin/bash
export PATH=~/projects/visor/hyperledger-frabic/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=~/projects/visor/hyperledger-frabic/fabric-samples/config
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_MSPCONFIGPATH=~/projects/visor/hyperledger-frabic/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=~/projects/visor/hyperledger-frabic/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
echo "✅ Environment set for Org1"
