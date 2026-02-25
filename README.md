# MEMBER 1: Blockchain Setup Guide for Judges

## 📋 Prerequisites Installation

### 1. Install Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in after this

# Install Docker Compose
sudo apt install docker-compose -y

# Install Go (1.17)
wget https://go.dev/dl/go1.17.13.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.17.13.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
source ~/.bashrc

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python (for import script)
sudo apt install -y python3 python3-pip
pip3 install requests



Step 1: Clone Repository

git clone https://github.com/Hrithi14/Visior.git
cd Visior/clinical-trial-blockchain



Step 2: Download Hyperledger Fabric

# Go to home directory
cd ~

# Download Fabric binaries
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.0

# This creates: fabric-samples/ and bin/ folders


Step 3: Start the Blockchain Network

cd ~/fabric-samples/test-network

# Start network with channel
./network.sh up createChannel -c mychannel

# Deploy sample chaincode (required for network)
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go


Step 4: Set Environment Variables

cd ~/Visior/clinical-trial-blockchain

# Create environment script
cat > setenv.sh << 'EOF'
#!/bin/bash
export PATH=~/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=~/fabric-samples/config
export ORDERER_CA=~/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ROOTCERT_FILE=~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
echo "✅ Environment set for Org1"
EOF

chmod +x setenv.sh
source ./setenv.sh



Step 5: Install Our Clinical Trial Chaincode

# Package chaincode
peer lifecycle chaincode package clinicaltrial.tar.gz \
  --path ./chaincode/clinicaltrial_go \
  --lang golang \
  --label clinicaltrial_1.0

# Install on Org1
peer lifecycle chaincode install clinicaltrial.tar.gz



Step 6: Initialize Ledger with Sample Data

peer chaincode invoke -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls --cafile $ORDERER_CA \
  -C mychannel -n clinicaltrial \
  --peerAddresses localhost:7051 --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE \
  --peerAddresses localhost:9051 --tlsRootCertFiles ~/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
  -c '{"function":"InitLedger","Args":[]}'
# Install on Org2
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_ADDRESS=localhost:9051
export CORE_PEER_TLS_ROOTCERT_FILE=~/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=~/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
peer lifecycle chaincode install clinicaltrial.tar.gz

# Get package ID
peer lifecycle chaincode queryinstalled
# Copy the ID (looks like clinicaltrial_1.0:hash...)

# Set package ID (replace with your actual ID)
export CC_PACKAGE_ID=clinicaltrial_1.0:YOUR_COPIED_ID_HERE

# Approve for Org2
peer lifecycle chaincode approveformyorg -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls --cafile $ORDERER_CA \
  --channelID mychannel --name clinicaltrial \
  --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1

# Approve for Org1
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ROOTCERT_FILE=~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
peer lifecycle chaincode approveformyorg -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls --cafile $ORDERER_CA \
  --channelID mychannel --name clinicaltrial \
  --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1

# Commit chaincode
peer lifecycle chaincode commit -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls --cafile $ORDERER_CA \
  --channelID mychannel --name clinicaltrial \
  --version 1.0 --sequence 1 \
  --peerAddresses localhost:7051 --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE \
  --peerAddresses localhost:9051 --tlsRootCertFiles ~/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
