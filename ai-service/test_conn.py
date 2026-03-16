import httpx
import asyncio

async def test(ip):
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            r = await client.get(f"http://{ip}:11434/api/tags")
            print(f"{ip}: Status {r.status_code}")
    except Exception as e:
        print(f"{ip}: Error {type(e).__name__}")

async def main():
    await test("172.17.0.1")
    await test("172.24.0.1")
    await test("host.docker.internal")

if __name__ == "__main__":
    asyncio.run(main())
