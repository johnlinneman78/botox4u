import paramiko
import sys
import os
import time
import traceback

def run_ssh_command(hostname, port, username, password, command):
    retries = 3
    for attempt in range(retries):
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            client.connect(hostname, port=port, username=username, password=password, timeout=15)
            stdin, stdout, stderr = client.exec_command(command)
            out = stdout.read().decode('utf-8', errors='ignore')
            err = stderr.read().decode('utf-8', errors='ignore')
            return out, err
        except paramiko.ssh_exception.AuthenticationException as ae:
            print(f"[Attempt {attempt+1}/{retries}] Auth failed: {ae}. Retrying in 5 seconds...", file=sys.stderr)
            time.sleep(5)
        except Exception as e:
            print(f"[Attempt {attempt+1}/{retries}] Error: {e}. Retrying in 5 seconds...", file=sys.stderr)
            time.sleep(5)
        finally:
            client.close()
    return "", "All SSH connection attempts failed."

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python ssh_helper.py <command>")
        sys.exit(1)
    
    cmd = sys.argv[1]
    host = "62.72.50.247"
    port = 65002
    username = "u343002691"
    password = "IL0sewip78!?!"
    
    out, err = run_ssh_command(host, port, username, password, cmd)
    print("--- STDOUT ---")
    sys.stdout.buffer.write(out.encode('utf-8', errors='ignore'))
    print("\n--- STDERR ---")
    sys.stdout.buffer.write(err.encode('utf-8', errors='ignore'))
    print()
