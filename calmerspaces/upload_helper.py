import paramiko
import sys
import os

def upload_file(hostname, port, username, password, local_path, remote_path):
    transport = paramiko.Transport((hostname, port))
    try:
        transport.connect(username=username, password=password)
        sftp = paramiko.SFTPClient.from_transport(transport)
        print(f"Uploading {local_path} to {remote_path}...")
        sftp.put(local_path, remote_path)
        print("Upload successful!")
    except Exception as e:
        print(f"Upload failed: {e}")
    finally:
        transport.close()

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python upload_helper.py <local_path> <remote_path>")
        sys.exit(1)
        
    local_path = sys.argv[1]
    remote_path = sys.argv[2]
    
    host = "62.72.50.247"
    port = 65002
    username = "u343002691"
    password = "IL0sewip78!?!"
    
    upload_file(host, port, username, password, local_path, remote_path)
