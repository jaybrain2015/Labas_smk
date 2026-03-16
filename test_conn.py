import httpx
import asyncio

async def test(label, url):
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            r = await client.get(url)
            print(f"{label} ({url}): Status {r.status_code}")
    except Exception as e:
        print(f"{label} ({url}): Error {type(e).__name__}")

async def main():
    await test("Host Local", "http://127.0.0.1:11434/api/tags")
    await test("Docker Gateway", "http://172.24.0.1:11434/api/tags")
    await test("Bridge default", "http://172.17.0.1:11434/api/tags")
    await test("Internet", "http://google.com")

if __name__ == "__main__":
    asyncio.run(main())
