# **Functional and Technical Requirements - File Converter**

## **1. Backend**  
The backend will be responsible for processing conversions, managing queues, security, and communication with the frontend.

### **1.1 API and Access Control**
- [x] Create **open REST API**, no authentication required, but with mechanisms to prevent abuse.
- [ ] Implement optional authentication/authorization as enabled in the configuration file
- [ ] Restrict access to files to the user who uploaded them.
  - [x] Create **unique tokens** for each upload and conversion.
  - [ ] Implement **temporary file-user association** (e.g., via user IP or another identifier).
- [ ] Limit the maximum file size for uploads.
- [ ] Implement **automatic expiration** for converted files to save storage.

### **1.2 File Conversion**
- [ ] Create a **modular conversion drivers system**:
  - [x] Each driver should implement a **standard interface** for compatibility.
  - [ ] Add initial support for popular formats such as:
    - [ ] **Images**: JPG, PNG, WebP, BMP, TIFF, SVG.
    - [ ] **Documents**: PDF, DOCX, TXT, Markdown.
    - [ ] **Audio**: MP3, WAV, OGG, FLAC.
    - [ ] **Video**: MP4, AVI, MKV, WebM.
    - [ ] **Compression**: ZIP, RAR, 7z, TAR.GZ.
- [ ] Implement **automatic MIME-type detection** for file uploads.
- [ ] Create a system for defining **extra parameters per conversion type** (e.g., image quality, audio bitrate, video resolution).

### **1.3 Queues and Asynchronous Processing**
- [x] Create an **asynchronous queue system** to avoid server overload.
- [ ] Implement **priority queues** to prevent large files from blocking the system.
- [x] Define **concurrency limits** to avoid server spikes.
- [ ] Create detailed **logs** of all operations.

### **1.4 WebSockets and Notifications**
- [ ] Implement **WebSockets** for:
  - [x] Notifying the frontend about **conversion status changes** (pending, processing, completed, error).
  - [ ] Updating the user interface in real-time.
- [ ] Create a **fallback mechanism** for users without WebSocket support (e.g., HTTP polling).

### **1.5 Optimizations and Monitoring**
- [ ] Implement **caching for recent conversions** to avoid redundant work.
- [ ] Add **compression for generated files** to reduce download time.
- [ ] Create **performance metrics**:
  - [ ] Average conversion time by file type.
  - [ ] Server load average.
  - [ ] Active and pending conversions count.

---

## **2. Frontend**
The frontend will be responsible for providing a smooth, responsive, and intuitive user experience.

### **2.1 Interface and Usability**
- [ ] Create a **responsive UI** optimized for both desktop and mobile.
- [ ] Implement **drag-and-drop** file upload.
- [ ] Display **progress bars** for each conversion.
- [ ] Show **real-time status updates** via WebSockets.
- [ ] Display the history of recently converted files.
- [ ] Implement **subtle animations** for better user feedback.

### **2.2 Optimization and Accessibility**
- [ ] Ensure **accessibility (WCAG)** in the UI.
- [ ] Implement **keyboard shortcuts** for fast navigation.
- [ ] Create a **dark mode** for visual comfort.
- [ ] Minimize resource usage to keep the application lightweight.

---

## **3. Security**
Security will be a critical factor, as the system does not require authentication.

### **3.1 Abuse Protection**
- [ ] Implement **rate limiting** to prevent abuse.
- [ ] Create a system to **reject potentially dangerous files**:
  - [ ] Verify **real MIME types** of uploaded files.
  - [ ] Block **scripts and executable files**.
- [ ] Define **maximum retention time** for converted files.

### **3.2 Process Isolation**
- [ ] Run each conversion in **isolated containers** to avoid running malicious code.
- [ ] Use restricted permissions to prevent unauthorized system access.

---

## **4. Deployment and Infrastructure**
- [ ] Create a **Dockerfile** for easy deployment and development environment setup.
- [ ] Set up **Kubernetes orchestration** for scalability.
- [ ] Implement **CDN** to optimize file downloads.
- [ ] Set up monitoring with **Prometheus + Grafana**.

---

### **Extras and Future Improvements**
- [ ] Add **integration with cloud services** (Google Drive, Dropbox).
