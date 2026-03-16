import socket
def test(ip, port):
    try:
        s = socket.create_connection((ip, port), timeout=2.0)
        print(f"{ip}:{port} is OPEN")
        s.close()
    except Exception as e:
        print(f"{ip}:{port} is CLOSED ({type(e).__name__})")

if __name__ == "__main__":
    test("172.17.0.1", 11434)
    test("172.24.0.1", 11434)
