# 1. Clone the repository (if not already done)
git clone https://github.com/Hrithi14/Visior.git
cd Visior

# 2. Switch to ml-modal branch
git checkout ml-modal

# 3. Go to ml-service folder
cd ml-service

# 4. Create virtual environment
python3 -m venv venv

# 5. Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# 6. Install dependencies
pip install -r requirements.txt

# 7. Run the service
python app.py
