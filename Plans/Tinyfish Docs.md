### Environment Setup

Source: https://docs.tinyfish.ai/install-with-ai

Instructions on how to set up your API key for authentication.

```APIDOC
## Environment Setup

### Description
Set up your TinyFish API key by obtaining it from the TinyFish website and adding it to your `.env` file.

### Method
Environment Variable

### Endpoint
N/A

### Parameters
#### Environment Variables
- **TINYFISH_API_KEY** (string) - Required - Your secret API key obtained from https://agent.tinyfish.ai/api-keys

### Request Example
```bash
# Get your API key at https://agent.tinyfish.ai/api-keys
# Add to .env file:
TINYFISH_API_KEY=sk-tinyfish-*****
```
```

--------------------------------

### Python - Synchronous Integration

Source: https://docs.tinyfish.ai/install-with-ai

Example code for integrating TinyFish Web Agent using the synchronous endpoint in Python.

```APIDOC
## Python - Synchronous Integration

### Description
This endpoint provides a synchronous way to interact with the TinyFish Web Agent in Python, returning the automation result directly upon completion.

### Method
POST

### Endpoint
`/v1/automation/run`

### Parameters
#### Headers
- **X-API-Key** (string) - Required - Your TinyFish API key.
- **Content-Type** (string) - Required - `application/json`

#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - A natural language description of the task to perform.

### Request Example
```json
{
  "url": "https://example.com/profile",
  "goal": "Update user profile information"
}
```

### Response
#### Success Response (200)
- **status** (string) - The status of the automation (e.g., `COMPLETED`).
- **result** (object) - The result of the automation task.

#### Error Response
- **status** (string) - The status of the automation (e.g., `FAILED`).
- **error** (object) - Error details if the automation failed.

#### Response Example
```json
{
  "status": "COMPLETED",
  "result": {
    "message": "Profile updated successfully"
  }
}
```

### Code Example (Python)
```python
import os
from dotenv import load_dotenv
import requests

load_dotenv()

def run_automation(url: str, goal: str):
    response = requests.post(
        "https://agent.tinyfish.ai/v1/automation/run",
        headers={
            "X-API-Key": os.environ["TINYFISH_API_KEY"],
            "Content-Type": "application/json",
        },
        json={"url": url, "goal": goal},
    )
    run = response.json()
    if run["status"] == "COMPLETED":
        return run["result"]
    raise Exception(run.get("error", {}).get("message", "Automation failed"))

# Example usage
profile_update_result = run_automation(
    "https://example.com/profile",
    "Update user profile information"
)
print(profile_update_result)
```
```

--------------------------------

### Environment Setup for TinyFish API Key

Source: https://docs.tinyfish.ai/install-with-ai

Instructions to set up your environment by obtaining an API key from TinyFish and adding it to your .env file for authentication.

```bash
# Get your API key at https://agent.tinyfish.ai/api-keys
# Add to .env file:
TINYFISH_API_KEY=sk-tinyfish-*****
```

--------------------------------

### Python - Streaming Integration

Source: https://docs.tinyfish.ai/install-with-ai

Example code for integrating TinyFish Web Agent using the streaming endpoint in Python.

```APIDOC
## Python - Streaming Integration

### Description
This endpoint allows you to stream automation progress and results in real-time using Python. It's ideal for applications that require continuous feedback during automation.

### Method
POST

### Endpoint
`/v1/automation/run-sse`

### Parameters
#### Headers
- **X-API-Key** (string) - Required - Your TinyFish API key.
- **Content-Type** (string) - Required - `application/json`

#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - A natural language description of the task to perform.

### Request Example
```json
{
  "url": "https://example.com/articles",
  "goal": "Extract all article titles and publication dates as JSON"
}
```

### Response
#### Success Response (200)
- **event.type** (string) - The type of event (e.g., `PROGRESS`, `COMPLETE`).
- **event.purpose** (string) - Description of the current action being performed (for `PROGRESS` events).
- **event.status** (string) - The status of the automation (e.g., `COMPLETED`, `FAILED`) (for `COMPLETE` events).
- **event.resultJson** (object) - The extracted data in JSON format (for successful `COMPLETE` events).
- **event.error** (object) - Error details if the automation failed.

#### Response Example
```json
{
  "type": "PROGRESS",
  "purpose": "Fetching content from https://example.com/articles"
}
```

```json
{
  "type": "COMPLETE",
  "status": "COMPLETED",
  "resultJson": [
    { "title": "Article 1", "date": "2023-01-01" },
    { "title": "Article 2", "date": "2023-01-15" }
  ]
}
```

### Code Example (Python)
```python
import os
import json
from dotenv import load_dotenv
import requests

load_dotenv()

def run_automation(url: str, goal: str):
    response = requests.post(
        "https://agent.tinyfish.ai/v1/automation/run-sse",
        headers={
            "X-API-Key": os.environ["TINYFISH_API_KEY"],
            "Content-Type": "application/json",
        },
        json={"url": url, "goal": goal},
        stream=True,
    )

    for line in response.iter_lines():
        if line:
            line = line.decode("utf-8")
            if line.startswith("data: "):
                event = json.loads(line[6:])
                if event["type"] == "PROGRESS":
                    print(f"Action: {event.get('purpose', '')}")
                elif event["type"] == "COMPLETE":
                    if event["status"] == "COMPLETED":
                        return event.get("resultJson")
                    raise Exception(event.get("error", {}).get("message", "Failed"))

# Example usage
products = run_automation(
    "https://example.com/products",
    "Extract all product names and prices as JSON"
)
print(products)
```
```

--------------------------------

### TypeScript - Synchronous Integration

Source: https://docs.tinyfish.ai/install-with-ai

Example code for integrating TinyFish Web Agent using the synchronous endpoint in TypeScript.

```APIDOC
## TypeScript - Synchronous Integration

### Description
This endpoint waits for the automation task to complete and returns the result directly. It's suitable for simpler tasks or when immediate results are needed.

### Method
POST

### Endpoint
`/v1/automation/run`

### Parameters
#### Headers
- **X-API-Key** (string) - Required - Your TinyFish API key.
- **Content-Type** (string) - Required - `application/json`

#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - A natural language description of the task to perform.

### Request Example
```json
{
  "url": "https://example.com/login",
  "goal": "Log in to the website using provided credentials"
}
```

### Response
#### Success Response (200)
- **status** (string) - The status of the automation (e.g., `COMPLETED`).
- **result** (object) - The result of the automation task.

#### Error Response
- **status** (string) - The status of the automation (e.g., `FAILED`).
- **error** (object) - Error details if the automation failed.

#### Response Example
```json
{
  "status": "COMPLETED",
  "result": {
    "message": "Login successful"
  }
}
```

### Code Example (TypeScript)
```typescript
import 'dotenv/config'

async function runAutomation(url: string, goal: string) {
  const response = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, goal }),
  });

  const run = await response.json();
  if (run.status === "COMPLETED") return run.result;
  throw new Error(run.error?.message || "Automation failed");
}

// Example usage
const loginResult = await runAutomation(
  "https://example.com/login",
  "Log in to the website using provided credentials"
);
console.log(loginResult);
```
```

--------------------------------

### Install MCP Server for AI Assistants (Bash)

Source: https://docs.tinyfish.ai/install-with-ai

Installs the MCP server for connecting TinyFish Web Agent to AI assistants. This command-line interface (CLI) tool is used to download and set up the necessary components. It requires Node.js and npm to be installed.

```bash
npx -y install-mcp@latest https://agent.tinyfish.ai/mcp --client claude-code
```

```bash
npx -y install-mcp@latest https://agent.tinyfish.ai/mcp --client cursor
```

```bash
npx -y install-mcp@latest https://agent.tinyfish.ai/mcp --client windsurf
```

```bash
npx -y install-mcp@latest https://agent.tinyfish.ai/mcp --client claude
```

--------------------------------

### TypeScript - Streaming Integration

Source: https://docs.tinyfish.ai/install-with-ai

Example code for integrating TinyFish Web Agent using the streaming endpoint in TypeScript.

```APIDOC
## TypeScript - Streaming Integration

### Description
This endpoint allows you to stream automation progress and results in real-time. It's recommended for a better user experience and handling complex workflows.

### Method
POST

### Endpoint
`/v1/automation/run-sse`

### Parameters
#### Headers
- **X-API-Key** (string) - Required - Your TinyFish API key.
- **Content-Type** (string) - Required - `application/json`

#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - A natural language description of the task to perform.

### Request Example
```json
{
  "url": "https://example.com/products",
  "goal": "Extract all product names and prices as JSON"
}
```

### Response
#### Success Response (200)
- **event.type** (string) - The type of event (e.g., `PROGRESS`, `COMPLETE`).
- **event.purpose** (string) - Description of the current action being performed (for `PROGRESS` events).
- **event.status** (string) - The status of the automation (e.g., `COMPLETED`, `FAILED`) (for `COMPLETE` events).
- **event.resultJson** (object) - The extracted data in JSON format (for successful `COMPLETE` events).
- **event.error** (object) - Error details if the automation failed.

#### Response Example
```json
{
  "type": "PROGRESS",
  "purpose": "Navigating to https://example.com/products"
}
```

```json
{
  "type": "COMPLETE",
  "status": "COMPLETED",
  "resultJson": [
    { "name": "Product A", "price": "$10.00" },
    { "name": "Product B", "price": "$20.00" }
  ]
}
```

### Code Example (TypeScript)
```typescript
import 'dotenv/config'

async function runAutomation(url: string, goal: string) {
  const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, goal }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const event = JSON.parse(line.slice(6));

        if (event.type === "PROGRESS") {
          console.log(`Action: ${event.purpose}`);
        } else if (event.type === "COMPLETE") {
          if (event.status === "COMPLETED") {
            return event.resultJson;
          }
          throw new Error(event.error?.message || "Automation failed");
        }
      }
    }
  }
}

// Example usage
const products = await runAutomation(
  "https://example.com/products",
  "Extract all product names and prices as JSON"
);
console.log(products);
```
```

--------------------------------

### Multi-step Workflow Goal Example - TinyFish AI

Source: https://docs.tinyfish.ai/key-concepts/goals

Example of a goal parameter for a multi-step workflow. This instruction outlines a sequence of actions including login, navigation, and data extraction.

```text
1. Login with email "user@example.com" and password "pass123"
2. Navigate to the dashboard
3. Extract account balance
```

--------------------------------

### Configure Anti-Detection Mode

Source: https://docs.tinyfish.ai/install-with-ai

This TypeScript example demonstrates how to enable anti-detection features for websites with bot protection. It shows the use of 'stealth' browser profile and configuring proxy settings, including country code selection.

```typescript
{
  "url": "https://protected-site.com",
  "goal": "Extract pricing data",
  "browser_profile": "stealth",
  "proxy_config": {
    "enabled": true,
    "country_code": "US",  // Also: GB, CA, DE, FR, JP, AU
  },
}
```

--------------------------------

### Run Web Automation with cURL

Source: https://docs.tinyfish.ai/quick-start

Execute a web automation task by sending a POST request to the TinyFish API endpoint using cURL. This example demonstrates how to extract specific data from a given URL based on a natural language goal.

```bash
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
            "url": "https://scrapeme.live/shop",
            "goal": "Extract the first 2 product names and prices"
          }'
```

--------------------------------

### Run Web Automation with Python

Source: https://docs.tinyfish.ai/quick-start

Automate web tasks using Python by sending a POST request to the TinyFish API. This script defines the target URL and a natural language objective, then iterates through the SSE stream to capture and print the automation progress and results.

```python
# first_automation.py
import json
import os
from dotenv import load_dotenv
import requests

load_dotenv()

response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run-sse",
    headers={
        "X-API-Key": os.getenv("TINYFISH_API_KEY"),
        "Content-Type": "application/json",
    },
    json={
        "url": "https://scrapeme.live/shop",  # Target website to automate
        "goal": "Extract the first 2 product names and prices",  # Natural language instruction
    },
    stream=True,  # Enable SSE streaming
)

# Read the SSE stream
for line in response.iter_lines():
    if line:
        line_str = line.decode("utf-8")
        if line_str.startswith("data: "):
            event = json.loads(line_str[6:])
            print(event)  # Print each event as it arrives
```

--------------------------------

### Execute First Workflow with Node.js

Source: https://docs.tinyfish.ai/quick-start

Run your first TinyFish AI web automation script written in TypeScript or JavaScript. This command uses `npx tsx` to execute the script, which will send the automation request to the TinyFish API.

```bash
npx tsx first-automation.ts
```

--------------------------------

### Execute First Workflow with Python

Source: https://docs.tinyfish.ai/quick-start

Execute your Python-based TinyFish AI web automation script. This command invokes the Python interpreter to run your script, initiating the web automation process.

```bash
python first_automation.py
```

--------------------------------

### Data Extraction Goal Example - TinyFish AI

Source: https://docs.tinyfish.ai/key-concepts/goals

Example of a goal parameter for extracting product information. This instruction specifies the desired data points (product name, price, stock status) and the output format (JSON).

```text
Extract product name, price, and stock status. Return as JSON.
```

--------------------------------

### Run Web Automation with JavaScript/TypeScript

Source: https://docs.tinyfish.ai/quick-start

Initiate a web automation task using JavaScript or TypeScript by making a POST request to the TinyFish API. This code snippet shows how to send the target URL and a natural language goal, then process the Server-Sent Events (SSE) stream for real-time results.

```javascript
import 'dotenv/config'

const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.TINYFISH_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://scrapeme.live/shop",  // Target website to automate
    goal: "Extract the first 2 product names and prices",  // Natural language instruction
  }),
});

// Read the SSE stream
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));  // Print each event as it arrives
}
```

--------------------------------

### POST /v1/automation/run-sse

Source: https://docs.tinyfish.ai/install-with-ai

Runs a web automation task using Server-Sent Events (SSE) for real-time updates. Useful for quick tests and monitoring progress.

```APIDOC
## POST /v1/automation/run-sse

### Description
This endpoint initiates a web automation task and streams results using Server-Sent Events. It's suitable for interactive testing and observing the automation process in real-time.

### Method
POST

### Endpoint
/v1/automation/run-sse

### Parameters
#### Query Parameters
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - A description of the task to perform on the website.

### Request Example
```bash
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ 
    "url": "https://scrapeme.live/shop", 
    "goal": "Extract the first 3 product names and prices" 
  }'
```

### Response
#### Success Response (200)
- The response will be a stream of Server-Sent Events containing updates on the automation task's progress and results.
```

--------------------------------

### POST /v1/automation/run-async

Source: https://docs.tinyfish.ai/api-reference/automation/start-automation-asynchronously

Starts an AI-powered browser automation asynchronously. This endpoint enqueues a task and returns a run ID immediately, allowing you to poll for results separately.

```APIDOC
## POST /v1/automation/run-async

### Description
Starts an automation run asynchronously. Creates and enqueues an automation task, returning the `run_id` immediately without waiting for completion. This is ideal for long-running automations where you intend to poll for results separately.

### Method
POST

### Endpoint
/v1/automation/run-async

### Parameters
#### Request Body
- **url** (string) - Required - Target website URL to automate.
- **goal** (string) - Required - Natural language description of what to accomplish on the website.
- **browser_profile** (string) - Optional - Browser profile for execution. Options: `lite`, `stealth`. Defaults to `lite`.
- **proxy_config** (object) - Optional - Proxy configuration for the automation run.
  - **enabled** (boolean) - Required - Enable proxy for this automation run.
  - **country_code** (string) - Optional - ISO 3166-1 alpha-2 country code for proxy location. Example: `US`, `GB`, `CA`, `DE`, `FR`, `JP`, `AU`.

### Request Example
```json
{
  "url": "https://example.com",
  "goal": "Find the pricing page and extract all plan details",
  "browser_profile": "stealth",
  "proxy_config": {
    "enabled": true,
    "country_code": "US"
  }
}
```

### Response
#### Success Response (200)
- **run_id** (string) - Unique identifier for the created automation run. Null if an error occurred during run creation.
- **error** (object) - Error details. Null if the run was created successfully.
  - **message** (string) - Error message if run creation failed.

#### Response Example
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "error": null
}
```

#### Error Response (400)
- **error** (object) - Contains details about the error.
  - **code** (string) - Error code (e.g., `MISSING_API_KEY`, `INVALID_INPUT`, `RATE_LIMIT_EXCEEDED`).
  - **message** (string) - A human-readable error message.

#### Error Response Example
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The provided URL is not valid."
  }
}
```
```

--------------------------------

### SearchTinyFishWebAgent

Source: https://docs.tinyfish.ai/mcp

Searches the TinyFish Web Agent knowledge base for relevant information, code examples, API references, and guides. This tool is useful for answering questions about the agent, finding documentation, understanding features, and locating implementation details.

```APIDOC
## POST /search

### Description
Searches across the TinyFish Web Agent knowledge base to find relevant information, code examples, API references, and guides. Use this tool when you need to answer questions about TinyFish Web Agent, find specific documentation, understand how features work, or locate implementation details. The search returns contextual content with titles and direct links to the documentation pages.

### Method
POST

### Endpoint
/search

### Parameters
#### Query Parameters
None

#### Request Body
- **query** (string) - Required - A query to search the content with.

### Request Example
```json
{
  "query": "How to use the authentication API?"
}
```

### Response
#### Success Response (200)
- **results** (array) - An array of search results, each containing title, content, and URL.

#### Response Example
```json
{
  "results": [
    {
      "title": "TinyFish Authentication API Guide",
      "content": "This guide explains how to authenticate with the TinyFish API...",
      "url": "https://docs.tinyfish.ai/auth"
    }
  ]
}
```
```

--------------------------------

### POST /v1/automation/run

Source: https://docs.tinyfish.ai/install-with-ai

Runs a web automation task based on a given URL and goal. It supports anti-detection features like stealth mode and proxy configuration.

```APIDOC
## POST /v1/automation/run

### Description
This endpoint initiates a web automation task. You provide a URL and a specific goal for the automation. It can also be configured with advanced options for sites with bot protection.

### Method
POST

### Endpoint
/v1/automation/run

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - A description of the task to perform on the website.
- **browser_profile** (string) - Optional - Specifies the browser profile to use. Use 'stealth' for anti-detection.
- **proxy_config** (object) - Optional - Configuration for using a proxy server.
  - **enabled** (boolean) - Required - Whether to enable the proxy.
  - **country_code** (string) - Optional - The country code for the proxy (e.g., US, GB, CA, DE, FR, JP, AU).

### Request Example
```json
{
  "url": "https://protected-site.com",
  "goal": "Extract pricing data",
  "browser_profile": "stealth",
  "proxy_config": {
    "enabled": true,
    "country_code": "US"
  }
}
```

### Response
#### Success Response (200)
- **status** (string) - The status of the automation task (e.g., 'COMPLETED').
- **result** (any) - The result of the automation task if the status is 'COMPLETED'.
- **error** (object) - Contains error details if the task failed.
  - **message** (string) - A message describing the error.

#### Response Example
```json
{
  "status": "COMPLETED",
  "result": [
    {
      "product_name": "Example Product",
      "price": "$19.99"
    }
  ]
}
```
```

--------------------------------

### MCP Integration Setup

Source: https://docs.tinyfish.ai/mcp-integration

Configuration snippets for integrating TinyFish Web Agent with various AI assistants.

```APIDOC
## MCP Integration Setup

### Claude Desktop (macOS/Windows)

Add the following to your configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tinyfish": {
      "url": "https://agent.tinyfish.ai/mcp"
    }
  }
}
```

Restart Claude Desktop and authenticate via OAuth.

### Cursor

Add the following to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "tinyfish": {
      "url": "https://agent.tinyfish.ai/mcp"
    }
  }
}
```

### Claude Code

Use the following command:

```bash
claude mcp add --transport http tinyfish https://agent.tinyfish.ai/mcp
```
```

--------------------------------

### API Endpoint Guide

Source: https://docs.tinyfish.ai/key-concepts/endpoints

A guide to choosing the appropriate API endpoint based on task requirements.

```APIDOC
## API Endpoint Selection Guide

### Description
This guide helps you select the most suitable API endpoint for your automation tasks based on their characteristics and your needs for progress updates and response types.

### Quick Decision Guide

<Steps>
  <Step title="Need real-time progress updates?">
    **Yes** → Use `/run-sse`
  </Step>

  <Step title="Task takes longer than 30 seconds?">
    **Yes** → Use `/run-async` + polling
  </Step>

  <Step title="Submitting multiple tasks at once?">
    **Yes** → Use `/run-async` (parallel submission)
  </Step>

  <Step title="Simple, quick task?">
    Use `/run` (synchronous)
  </Step>
</Steps>

### Comparison Table

| Feature          | `/run`       | `/run-async`     | `/run-sse`   |
| ---------------- | ------------ | ---------------- | ------------ |
| Response type    | Final result | Run ID           | Event stream |
| Progress updates | No           | No (poll status) | Yes          |
| Streaming URL    | In response  | Poll to get      | In events    |
| Best for         | Quick tasks  | Batch/long tasks | Real-time UI |
| Complexity       | Low          | Medium           | Medium       |
```

--------------------------------

### Form Filling Goal Example - TinyFish AI

Source: https://docs.tinyfish.ai/key-concepts/goals

Example of a goal parameter for filling out a contact form. This instruction specifies the form fields, their values, and the action to submit the form.

```text
Fill the contact form with name "John Doe" and email "john@example.com", then click Submit.
```

--------------------------------

### Run Automation with Python

Source: https://docs.tinyfish.ai/install-with-ai

This Python snippet shows how to send a POST request to the Tinyfish AI automation endpoint. It includes setting the API key from environment variables, specifying the URL and goal, and handling the response, including error checking.

```python
import requests
import os

url = "https://example.com"
goal = "Extract specific data"

response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run",
    headers={
        "X-API-Key": os.environ["TINYFISH_API_KEY"],
        "Content-Type": "application/json",
    },
    json={"url": url, "goal": goal},
)
run = response.json()
if run["status"] == "COMPLETED":
    print(run["result"])
else:
    raise Exception(run.get("error", {}).get("message", "Failed"))
```

--------------------------------

### Start Automation Asynchronously

Source: https://docs.tinyfish.ai/api-reference/automation/start-automation-asynchronously

Creates and enqueues an automation run, returning the run_id immediately without waiting for completion. Ideal for long-running automations where polling for results is preferred.

```APIDOC
## POST /websites/tinyfish_ai/automations/run

### Description
Initiates an automation run asynchronously. The API returns a run ID immediately, allowing the client to poll for the completion status and results separately. This is suitable for lengthy automation processes.

### Method
POST

### Endpoint
/websites/tinyfish_ai/automations/run

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **automation_type** (string) - Required - Specifies the type of automation to run.
- **parameters** (object) - Optional - A JSON object containing parameters specific to the chosen automation type.

### Request Example
```json
{
  "automation_type": "data_processing",
  "parameters": {
    "input_file": "s3://my-bucket/input.csv",
    "output_format": "json"
  }
}
```

### Response
#### Success Response (200)
- **run_id** (string) - A unique identifier for the initiated automation run.
- **status** (string) - The initial status of the automation run (e.g., "queued", "running").

#### Response Example
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "status": "queued"
}
```
```

--------------------------------

### run_web_automation_async

Source: https://docs.tinyfish.ai/mcp-integration

Starts automation asynchronously and returns a run ID immediately. Ideal for long-running tasks.

```APIDOC
## POST /run_web_automation_async

### Description
Starts automation asynchronously and returns a `run_id` immediately. Use this for long-running tasks where you don't need real-time progress.

### Method
POST

### Endpoint
`/run_web_automation_async`

### Parameters
#### Query Parameters
- **url** (string) - Required - Target website URL
- **goal** (string) - Required - Natural language description of what to do
- **browser_profile** (string) - Optional - `lite` (default) or `stealth` for anti-detection
- **proxy_config** (object) - Optional - Proxy settings with `enabled` and `country_code`
  - **enabled** (boolean) - Required - Whether the proxy is enabled
  - **country_code** (string) - Optional - The country code for the proxy

### Request Example
```json
{
  "url": "https://store.com",
  "goal": "Extract all products",
  "browser_profile": "lite"
}
```

### Response
#### Success Response (200)
- **run_id** (string) - The ID of the asynchronous run.
- **error** (object | null) - An error object if the run failed to start, otherwise null.

#### Response Example
```json
{
  "run_id": "abc123-...",
  "error": null
}
```
```

--------------------------------

### API Event Data Examples

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming

Examples of data payloads for different events in the Tinyfish AI API. These include task initiation, streaming URL provision, progress updates, and completion status with results.

```json
data:
{"type":"STARTED","runId":"run_123","timestamp":"2025-01-01T00:00:00Z"}
```

```json
data:
{"type":"STREAMING_URL","runId":"run_123","streamingUrl":"https://...","timestamp":"..."}
```

```json
data: {"type":"PROGRESS","runId":"run_123","purpose":"Clicking
                submit button","timestamp":"..."}
```

```json
data:
{"type":"COMPLETE","runId":"run_123","status":"COMPLETED","resultJson":{...},"timestamp":"..."}
```

--------------------------------

### REST API Authentication Example (Python)

Source: https://docs.tinyfish.ai/authentication

Provides a Python example for authenticating REST API requests by including the API key in the 'X-API-Key' header. It utilizes environment variables for secure key management.

```python
import os
import requests

response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run",
    headers={
        "X-API-Key": os.getenv("TINYFISH_API_KEY"),
        "Content-Type": "application/json",
    },
    json={
        "url": "https://example.com",
        "goal": "Extract the page title",
    },
)
```

--------------------------------

### Environment Variable Setup for API Key

Source: https://docs.tinyfish.ai/authentication

Instructions on how to store your TinyFish API key securely using environment variables. This is recommended for both shell environments and Node.js projects using a .env file.

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export TINYFISH_API_KEY="your_api_key_here"
```

```bash
# .env
TINYFISH_API_KEY=your_api_key_here
```

--------------------------------

### Submit and Monitor TinyFish Runs

Source: https://docs.tinyfish.ai/examples/bulk-requests-async

This section details how to submit multiple TinyFish Web Agent runs asynchronously and poll for their completion status. It includes examples in Python and TypeScript.

```APIDOC
## POST /v1/automation/run-async

### Description
Submits a web agent run asynchronously and returns a run ID for later status checks.

### Method
POST

### Endpoint
https://agent.tinyfish.ai/v1/automation/run-async

### Parameters
#### Request Body
- **url** (string) - Required - The URL to scrape.
- **goal** (string) - Required - The objective for the web agent.

### Request Example
```json
{
  "url": "https://scrapeme.live/shop/",
  "goal": "Extract all available products on page two with their name, price, and review rating (if available)"
}
```

### Response
#### Success Response (200)
- **run_id** (string) - The unique identifier for the submitted run.

#### Response Example
```json
{
  "run_id": "run_abc123xyz"
}
```

## GET /v1/runs/{run_id}

### Description
Retrieves the status and results of a specific web agent run using its run ID.

### Method
GET

### Endpoint
https://agent.tinyfish.ai/v1/runs/{run_id}

### Parameters
#### Path Parameters
- **run_id** (string) - Required - The unique identifier of the run to query.

### Response
#### Success Response (200)
- **run_id** (string) - The unique identifier for the run.
- **status** (string) - The current status of the run (e.g., "PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED").
- **result** (object) - The result of the run if completed successfully (structure depends on the goal).

#### Response Example
```json
{
  "run_id": "run_abc123xyz",
  "status": "COMPLETED",
  "result": {
    "products": [
      {
        "name": "Product A",
        "price": "$19.99",
        "rating": "4.5"
      }
    ]
  }
}
```
```

--------------------------------

### Handling Pagination

Source: https://docs.tinyfish.ai/faq

Provides an example of how to configure TinyFish Web Agent to handle pagination. This involves specifying actions like clicking a 'Next Page' button multiple times to extract data across different pages.

```typescript
goal: `Click "Next Page" button 5 times, extracting products from each page`
```

--------------------------------

### POST /v1/automation/run-async (Asynchronous)

Source: https://docs.tinyfish.ai/key-concepts/endpoints

Starts an automation asynchronously. Returns a run ID immediately, allowing you to poll for the result later. Suitable for long-running tasks.

```APIDOC
## POST /v1/automation/run-async

### Description
Starts an automation asynchronously. Returns a run ID immediately, allowing you to poll for the result later. Suitable for long-running tasks and batch processing.

### Method
POST

### Endpoint
/v1/automation/run-async

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - The objective for the automation.

### Request Example
```json
{
  "url": "https://example.com",
  "goal": "Extract all product data"
}
```

### Response
#### Success Response (200)
- **run_id** (string) - The unique identifier for the automation run.

#### Response Example
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

## GET /v1/runs/{run_id}

### Description
Polls for the status and result of an asynchronous automation run.

### Method
GET

### Endpoint
/v1/runs/{run_id}

### Parameters
#### Path Parameters
- **run_id** (string) - Required - The ID of the run to check.

### Response
#### Success Response (200)
- **status** (string) - The current status of the run (e.g., PENDING, RUNNING, COMPLETED, FAILED, CANCELLED).
- **result** (any) - The result of the automation (available when status is COMPLETED).

#### Response Example
```json
{
  "status": "COMPLETED",
  "result": [
    {
      "name": "Product 1",
      "price": "$10.00"
    }
  ]
}
```

## POST /v1/runs/{run_id}/cancel

### Description
Cancels a running automation.

### Method
POST

### Endpoint
/v1/runs/{run_id}/cancel

### Parameters
#### Path Parameters
- **run_id** (string) - Required - The ID of the run to cancel.

### Response
#### Success Response (200)
- (No specific response body mentioned, typically an empty success or status confirmation)

#### Response Example
```json
{
  "message": "Run cancelled successfully"
}
```
```

--------------------------------

### Quick Test with cURL

Source: https://docs.tinyfish.ai/install-with-ai

This cURL command provides a quick way to test the Tinyfish AI automation endpoint using Server-Sent Events (SSE). It demonstrates how to send a POST request with the API key and a JSON payload containing the URL and goal.

```bash
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
            "url": "https://scrapeme.live/shop",
            "goal": "Extract the first 3 product names and prices"
          }'
```

--------------------------------

### Handle Edge Cases in AI Goals

Source: https://docs.tinyfish.ai/ai-integration

Instruct the AI agent on how to manage unexpected situations, such as unavailable pricing information or the appearance of CAPTCHAs, to ensure robust automation.

```text
If price shows "Contact Us" or "Request Quote":
  Set price to null
  Set price_type to "contact_required"

If a CAPTCHA appears:
  Stop immediately
  Return partial results with an error flag
```

--------------------------------

### Server-Sent Events (SSE) Response Structure

Source: https://docs.tinyfish.ai/api-reference

This example illustrates the format of the Server-Sent Events (SSE) stream received when running a browser automation task. The stream contains various event types such as STARTED, STREAMING_URL, PROGRESS, and COMPLETE, each with a unique run ID and timestamp. The COMPLETE event may include a result JSON.

```text/event-stream
"data: {\"type\":\"STARTED\",\"runId\":\"run_123\",\"timestamp\":\"2025-01-01T00:00:00Z\"}

data: {\"type\":\"STREAMING_URL\",\"runId\":\"run_123\",\"streamingUrl\":\"https://...\",\"timestamp\":\"...\"}

data: {\"type\":\"PROGRESS\",\"runId\":\"run_123\",\"purpose\":\"Clicking submit button\",\"timestamp\":\"...\"}

data: {\"type\":\"COMPLETE\",\"runId\":\"run_123\",\"status\":\"COMPLETED\",\"resultJson\":{...},\"timestamp\":\"...\"}"
```

--------------------------------

### Configuring Stealth Mode and Proxies in Tinyfish AI

Source: https://docs.tinyfish.ai/faq

Illustrates how to configure stealth mode and proxy settings within Tinyfish AI configurations to bypass anti-bot measures and improve site access. Includes examples for enabling stealth mode and setting up a proxy with a specified country code.

```typescript
// Use stealth mode
browser_profile: "stealth"

// Add proxy
proxy_config: {
  enabled: true,
  country_code: "US"
}

// Reduce speed (add delays in goal)
goal: "Wait 3 seconds, then click button"
```

--------------------------------

### Batch Fill Multiple Forms Concurrently (Python)

Source: https://docs.tinyfish.ai/examples/bulk-requests-sync

Fills multiple contact forms concurrently using Python's asyncio and aiohttp. This example demonstrates how to dynamically generate form submission goals based on company data and process them in parallel. It assumes the `run_tinyfish` function from the previous example is available.

```python
async def main():
    companies = [
        {"name": "Acme Corp", "url": "https://acme.com/contact"},
        {"name": "TechStart", "url": "https://techstart.io/contact"},
        {"name": "BuildIt", "url": "https://buildit.com/contact"},
    ]

    async with aiohttp.ClientSession() as session:
        tasks = [
            run_tinyfish(
                session,
                company["url"],
                f"""Fill in the contact form:
                    - Name field: \"John Doe\"
                    - Email field: \"john@example.com\"
                    - Message field: \"Interested in partnership with {company['name']}\"\n                    Then click Submit and extract the success message.
                """
            )
            for company in companies
        ]

        results = await asyncio.gather(*tasks)

        for company, result in zip(companies, results):
            print(f"{company['name']}: {result}")
```

--------------------------------

### REST API Authentication Example (TypeScript)

Source: https://docs.tinyfish.ai/authentication

Shows how to authenticate a REST API request in TypeScript using an API key from an environment variable, passed in the 'X-API-Key' header. This is for use in Node.js environments.

```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://example.com",
      goal: "Extract the page title",
    }),
  });
```

--------------------------------

### GET /websites/tinyfish_ai/runs/{run_id}

Source: https://docs.tinyfish.ai/api-reference/runs/get-run-by-id

Retrieves the details of a specific automation run, including its status, goal, results, and browser configuration.

```APIDOC
## GET /websites/tinyfish_ai/runs/{run_id}

### Description
Retrieves the details of a specific automation run identified by its unique `run_id`. This includes information about the run's status, its objective, the configuration used, and the outcome.

### Method
GET

### Endpoint
`/websites/tinyfish_ai/runs/{run_id}`

### Parameters
#### Path Parameters
- **run_id** (string) - Required - The unique identifier for the automation run.

### Request Example
(No request body for GET requests)

### Response
#### Success Response (200)
- **run_id** (string) - The unique identifier for the automation run.
- **status** (string) - The current status of the run (e.g., 'completed', 'running', 'failed').
- **goal** (string) - The objective or purpose of the automation run.
- **created_at** (string) - Timestamp when the run was created.
- **started_at** (string) - Timestamp when the run started.
- **finished_at** (string) - Timestamp when the run finished.
- **result** (object) - The outcome of the automation run.
- **error** (object) - Details about any errors encountered during the run.
- **streaming_url** (string) - URL for streaming real-time updates of the run.
- **browser_config** (object) - Configuration details for the browser used in the run.

#### Response Example
```json
{
  "run_id": "run_abc123",
  "status": "completed",
  "goal": "Scrape product prices from example.com",
  "created_at": "2023-10-27T10:00:00Z",
  "started_at": "2023-10-27T10:05:00Z",
  "finished_at": "2023-10-27T10:15:00Z",
  "result": {
    "data": [
      {
        "product": "Example Product",
        "price": "$19.99"
      }
    ]
  },
  "error": null,
  "streaming_url": "wss://example.com/stream/run_abc123",
  "browser_config": {
    "name": "chrome",
    "version": "latest",
    "platform": "windows"
  }
}
```

#### Error Response (401)
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or missing API key provided.",
    "details": null
  }
}
```

#### Error Response (404)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Run with the specified ID not found.",
    "details": null
  }
}
```

#### Error Response (500)
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred on the server.",
    "details": null
  }
}
```

### Security
- ApiKeyAuth
```

--------------------------------

### REST API Authentication Example (cURL)

Source: https://docs.tinyfish.ai/authentication

Demonstrates how to authenticate a REST API request using an API key passed in the 'X-API-Key' header. This method is suitable for direct HTTP requests from your code.

```bash
curl -X POST https://agent.tinyfish.ai/v1/automation/run \
    -H "X-API-Key: $TINYFISH_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com", "goal": "Extract the page title"}'
```

--------------------------------

### Example Request with API Key Header (Bash)

Source: https://docs.tinyfish.ai/error-codes

Demonstrates how to include the required 'X-API-Key' header in a cURL request to authenticate with the Tinyfish AI API. This is a common solution for 'MISSING_API_KEY' errors.

```bash
curl -H "X-API-Key: $TINYFISH_API_KEY" ...
```

--------------------------------

### Automate Multi-Step Form Submission

Source: https://docs.tinyfish.ai/examples/form-filling

Submit data to a multi-step form and extract a confirmation number. This example requires a Tinyfish API key and specifies the URL and a detailed goal for form completion across multiple steps.

```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.TINYFISH_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com/signup",
    goal: `Complete the multi-step signup form:

      Step 1 (Personal Info):
      - First name: "John"
      - Last name: "Doe"
      - Email: "john@example.com"
      - Click "Next"

      Step 2 (Address):
      - Street: "123 Main St"
      - City: "San Francisco"
      - State: "CA"
      - ZIP: "94102"
      - Click "Next"

      Step 3 (Preferences):
      - Select "Email notifications" checkbox
      - Click "Submit"

      Extract the confirmation number from the success page.
    `,
  }),
});
```

```python
response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run-sse",
    headers={
        "X-API-Key": api_key,
        "Content-Type": "application/json",
    },
    json={
        "url": "https://example.com/signup",
        "goal": """Complete the multi-step signup form:

            Step 1 (Personal Info):
            - First name: "John"
            - Last name: "Doe"
            - Email: "john@example.com"
            - Click "Next"

            Step 2 (Address):
            - Street: "123 Main St"
            - City: "San Francisco"
            - State: "CA"
            - ZIP: "94102"
            - Click "Next"

            Step 3 (Preferences):
            - Select "Email notifications" checkbox
            - Click "Submit"

            Extract the confirmation number from the success page.
        """,
    },
    stream=True,
)
```

```bash
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ \
    "url": "https://example.com/signup", \
    "goal": "Complete the multi-step signup form: Step 1 - First name John, Last name Doe, Email john@example.com, click Next. Step 2 - Street 123 Main St, City San Francisco, State CA, ZIP 94102, click Next. Step 3 - Select Email notifications checkbox, click Submit. Extract the confirmation number." \
    }'
```

--------------------------------

### Defining Effective Goals in Tinyfish AI

Source: https://docs.tinyfish.ai/faq

Provides examples of well-defined and poorly-defined goals for Tinyfish AI automations. Emphasizes specificity and actionability for good goals, contrasting them with vague objectives.

```typescript
goal: "Extract product name, price, and stock status from the product details section"
```

```typescript
goal: "Get data"
```

--------------------------------

### GET /v1/runs/{id}

Source: https://docs.tinyfish.ai/api-reference/runs/get-run-by-id

Retrieves detailed information about a specific automation run using its unique identifier.

```APIDOC
## GET /v1/runs/{id}

### Description
Get detailed information about a specific automation run by its ID.

### Method
GET

### Endpoint
/v1/runs/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - Run ID

### Responses
#### Success Response (200)
- **run_id** (string) - Unique identifier for the run
- **status** (string) - Current status of the run (enum: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED)
- **goal** (string) - Natural language goal for this automation run
- **created_at** (string) - ISO 8601 timestamp when run was created
- **started_at** (string) - ISO 8601 timestamp when run started executing (nullable)
- **finished_at** (string) - ISO 8601 timestamp when run finished (nullable)
- **result** (object) - Extracted data from the automation run (nullable)
- **error** (object) - Error details. Null if the run succeeded or is still running (nullable)
  - **message** (string) - Error message describing why the run failed
  - **help_url** (string) - URL to documentation for troubleshooting (nullable)
  - **help_message** (string) - Human-readable help message with guidance (nullable)
- **streaming_url** (string) - URL to watch live browser session (available while running) (nullable)
- **browser_config** (object) - Browser configuration used for the run (nullable)
  - **proxy_enabled** (boolean) - Whether proxy was enabled
  - **proxy_country_code** (string) - Country code for proxy

#### Response Example
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "COMPLETED",
  "goal": "Find all pricing information",
  "created_at": "2026-01-14T10:30:00Z",
  "started_at": "2026-01-14T10:30:05Z",
  "finished_at": "2026-01-14T10:31:30Z",
  "result": {
    "price": "$99.99"
  },
  "error": null,
  "streaming_url": null,
  "browser_config": {
    "proxy_enabled": false,
    "proxy_country_code": "US"
  }
}
```
```

--------------------------------

### Configure TinyFish MCP Server for Windsurf (JSON)

Source: https://docs.tinyfish.ai/install-with-ai

Manually configures the TinyFish MCP server for Windsurf. This JSON configuration snippet needs to be placed in the specified configuration file (`~/.codeium/windsurf/mcp_config.json` on macOS/Linux or `%USERPROFILE%\.codeium\windsurf\mcp_config.json` on Windows). It defines the server URL.

```json
{
  "mcpServers": {
    "tinyfish": {
      "serverUrl": "https://agent.tinyfish.ai/mcp"
    }
  }
}
```

--------------------------------

### Python: Synchronous Automation with TinyFish

Source: https://docs.tinyfish.ai/install-with-ai

Integrates TinyFish Web Agent using the synchronous endpoint (/run) in Python. This function makes a POST request and returns the result upon completion. It requires the 'python-dotenv' and 'requests' libraries.

```python
import os
from dotenv import load_dotenv
import requests

load_dotenv()

def run_automation(url: str, goal: str):

```

--------------------------------

### Python: Stream Automation with TinyFish

Source: https://docs.tinyfish.ai/install-with-ai

Integrates TinyFish Web Agent using the streaming endpoint (/run-sse) in Python. This function processes Server-Sent Events to display progress and retrieve results. It requires the 'python-dotenv' and 'requests' libraries.

```python
import os
import json
from dotenv import load_dotenv
import requests

load_dotenv()

def run_automation(url: str, goal: str):
    response = requests.post(
        "https://agent.tinyfish.ai/v1/automation/run-sse",
        headers={
            "X-API-Key": os.environ["TINYFISH_API_KEY"],
            "Content-Type": "application/json",
        },
        json={"url": url, "goal": goal},
        stream=True,
    )

    for line in response.iter_lines():
        if line:
            line = line.decode("utf-8")
            if line.startswith("data: "):
                event = json.loads(line[6:])
                if event["type"] == "PROGRESS":
                    print(f"Action: {event.get('purpose', '')}")
                elif event["type"] == "COMPLETE":
                    if event["status"] == "COMPLETED":
                        return event.get("resultJson")
                    raise Exception(event.get("error", {}).get("message", "Failed"))

# Example usage
products = run_automation(
    "https://example.com/products",
    "Extract all product names and prices as JSON"
)

```

--------------------------------

### POST /websites/tinyfish_ai

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming

This endpoint is used to initiate an action or submit data related to the tinyfish_ai website project. It supports various event types like STARTED, STREAMING_URL, PROGRESS, and COMPLETE, each with specific required fields.

```APIDOC
## POST /websites/tinyfish_ai

### Description
This endpoint is used to initiate an action or submit data related to the tinyfish_ai website project. It supports various event types like STARTED, STREAMING_URL, PROGRESS, and COMPLETE, each with specific required fields.

### Method
POST

### Endpoint
/websites/tinyfish_ai

### Parameters
#### Query Parameters
- **apiKey** (string) - Required - Your API key for authentication.

#### Request Body
- **data** (object) - Required - The payload containing event details.
  - **type** (string) - Required - The type of event (e.g., STARTED, STREAMING_URL, PROGRESS, COMPLETE).
  - **runId** (string) - Required for PROGRESS and COMPLETE events - A unique identifier for the run.
  - **status** (string) - Required for COMPLETE events - The final status of the run (e.g., COMPLETED).
  - **timestamp** (string) - Required - The timestamp of the event in ISO 8601 format.
  - **streamingUrl** (string) - Required for STREAMING_URL events - The URL for streaming data.
  - **purpose** (string) - Required for PROGRESS events - A description of the current progress.
  - **resultJson** (object) - Optional for COMPLETE events - JSON object containing the results.

### Request Example
```json
{
  "data": {
    "type": "STARTED",
    "runId": "run_123",
    "timestamp": "2025-01-01T00:00:00Z"
  }
}
```

### Response
#### Success Response (200)
- **message** (string) - A success message indicating the request was processed.

#### Response Example
```json
{
  "message": "Event processed successfully."
}
```

#### Error Responses
- **400 Bad Request**: Invalid request - missing required fields or invalid format.
- **401 Unauthorized**: Invalid or missing API key.
- **500 Internal Server Error**: An unexpected error occurred on the server.
```

--------------------------------

### TypeScript: Stream Automation with TinyFish

Source: https://docs.tinyfish.ai/install-with-ai

Integrates TinyFish Web Agent using the streaming endpoint (/run-sse) in TypeScript. This method provides real-time progress updates and is recommended for interactive applications. It requires the 'dotenv' package for API key management.

```typescript
import 'dotenv/config'

async function runAutomation(url: string, goal: string) {
  const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, goal }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const event = JSON.parse(line.slice(6));

        if (event.type === "PROGRESS") {
          console.log(`Action: ${event.purpose}`);
        } else if (event.type === "COMPLETE") {
          if (event.status === "COMPLETED") {
            return event.resultJson;
          }
          throw new Error(event.error?.message || "Automation failed");
        }
      }
    }
  }
}

// Example usage
const products = await runAutomation(
  "https://example.com/products",
  "Extract all product names and prices as JSON"
);

```

--------------------------------

### TypeScript: Synchronous Automation with TinyFish

Source: https://docs.tinyfish.ai/install-with-ai

Integrates TinyFish Web Agent using the synchronous endpoint (/run) in TypeScript. This method waits for the automation to complete before returning the result. It requires the 'dotenv' package for API key management.

```typescript
import 'dotenv/config'

async function runAutomation(url: string, goal: string) {
  const response = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, goal }),
  });

  const run = await response.json();
  if (run.status === "COMPLETED") return run.result;
  throw new Error(run.error?.message || "Automation failed");
}

```

--------------------------------

### Cancel SSE Run

Source: https://docs.tinyfish.ai/key-concepts/endpoints

You can cancel a streaming run using the run_id obtained from the STARTED event.

```APIDOC
## POST /v1/runs/{runId}/cancel

### Description
Cancels a currently running automation process.

### Method
POST

### Endpoint
`/v1/runs/{runId}/cancel`

### Parameters
#### Path Parameters
- **runId** (string) - Required - The unique identifier of the run to cancel.

#### Headers
- **X-API-Key** (string) - Required - Your Tinyfish API key.

### Request Example
```typescript
await fetch(`https://agent.tinyfish.ai/v1/runs/${runId}/cancel`, {
  method: "POST",
  headers: { "X-API-Key": process.env.TINYFISH_API_KEY },
});
```

### Response
#### Success Response (204 No Content)
This endpoint typically returns no content upon successful cancellation.

#### Error Response (404 Not Found)
- **message** (string) - Description of the error, e.g., 'Run not found'.
```

--------------------------------

### Specify Output Schema for AI Goals

Source: https://docs.tinyfish.ai/ai-integration

Define the exact JSON structure required for the AI agent's output. This ensures consistent data formatting by the TinyFish Web Agent.

```json
{
  "product_name": "string",
  "price": number or null,
  "in_stock": boolean
}
```

--------------------------------

### Request Structured Errors for AI

Source: https://docs.tinyfish.ai/ai-integration

Configure the AI to request detailed, parseable error information when an extraction fails. This allows the agent to programmatically handle errors.

```json
{
  "success": false,
  "error_type": "timeout" or "blocked" or "not_found",
  "error_message": "Description of what went wrong",
  "partial_results": [any data captured before failure]
}
```

--------------------------------

### API Error Response: Unauthorized (401)

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming

Example of a 401 Unauthorized response, typically due to an invalid or missing API key. The error object provides context for the authentication failure.

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid API key provided",
    "details": null
  }
}
```

--------------------------------

### Watching Runs Live

Source: https://docs.tinyfish.ai/key-concepts/runs

Instructions on how to use the `streamingUrl` to watch a run's browser execution in real-time.

```APIDOC
## Watching Runs Live

Every run includes a `streamingUrl` where you can watch the browser execute in real-time. This is useful for debugging, demos, or showing users what's happening behind the scenes.

Embed the URL in an iframe to display the live browser view in your app:

```html
<iframe
  src="https://stream.mino.ai/session/abc123"
  width="800"
  height="600"
/>
```

The streaming URL is valid for 24 hours after the run completes.
```

--------------------------------

### Parse Success Response from TinyFish Web Agent

Source: https://docs.tinyfish.ai/ai-integration

Handle the JSON response when the TinyFish Web Agent automation completes successfully and achieves the specified goal.

```json
{
  "status": "COMPLETED",
  "result": {
    "products": [
      { "name": "Widget", "price": 29.99, "in_stock": true }
    ]
  }
}
```

--------------------------------

### API Error Response: Bad Request (400)

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming

Example of a 400 Bad Request response, indicating invalid input or missing required fields. The error object details the specific issue.

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Field \"url\" is required and must be a string",
    "details": null
  }
}
```

--------------------------------

### Define Termination Conditions for AI Goals

Source: https://docs.tinyfish.ai/ai-integration

Set clear stopping criteria for AI-driven automations to prevent infinite loops. This includes conditions like item limits, button availability, page counts, or login prompts.

```text
Stop when ANY of these is true:
- You have extracted 20 items
- No more "Load More" button exists
- You have processed 5 pages
- The page shows a login prompt
```

--------------------------------

### Get Run Details

Source: https://docs.tinyfish.ai/mcp-integration

Retrieve the status and results of a specific web automation run using its ID. This is essential for checking the outcome of asynchronous tasks. The response includes the run ID, status, goal, and results or error information.

```json
{
  "tool_code": "get_run",
  "id": "abc123-..."
}
```

--------------------------------

### Use Numbered Steps for Sequential Workflows

Source: https://docs.tinyfish.ai/prompting-guide

Structure multi-step processes using numbered instructions. This ensures the agent follows a defined sequence of actions, crucial for tasks like form submission or complex navigation.

```text
1. Click "Login"
2. Enter username "demo@example.com"
3. Enter password "demo123"
4. Click "Submit"
5. Wait for dashboard to load
6. Extract the account balance shown in the header
```

--------------------------------

### Handle Rate Limits with Exponential Backoff (Python)

Source: https://docs.tinyfish.ai/error-codes

Provides a Python code example demonstrating how to implement exponential backoff to handle 'RATE_LIMIT_EXCEEDED' errors. This strategy involves increasing wait times between retries to avoid overwhelming the API.

```python
import time
import random

# Assuming RateLimitError is defined elsewhere
# class RateLimitError(Exception): pass

def call_with_backoff(fn, max_retries=5):
    for attempt in range(max_retries):
        try:
            return fn()
        except RateLimitError:
            if attempt == max_retries - 1:
                raise
            wait = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait)
```

--------------------------------

### Interpreting Automation Run Status and Results

Source: https://docs.tinyfish.ai/faq

Understand the meaning of 'COMPLETED' and 'FAILED' statuses in Tinyfish AI automation runs. Differentiate between infrastructure success and goal achievement by examining the 'result' field. Provides examples of successful data extraction, goal failure despite infrastructure success, and infrastructure failure.

```json
{
  "status": "COMPLETED",
  "result": {
    "products": [
      { "name": "iPhone 15", "price": "$799" }
    ]
  },
  "error": null
}
```

```json
{
  "status": "COMPLETED",
  "result": {
    "status": "failure",
    "reason": "Could not find any products on the page",
    "product_price": null
  },
  "error": null
}
```

```json
{
  "status": "FAILED",
  "result": null,
  "error": {
    "message": "Browser crashed during execution"
  }
}
```

--------------------------------

### Asynchronous API Call with /run-async and Polling

Source: https://docs.tinyfish.ai/key-concepts/endpoints

Starts an automation asynchronously using the /run-async endpoint, returning a run ID. The result is then retrieved by polling the /runs/{run_id} endpoint. This pattern is ideal for long-running tasks and batch processing.

```typescript
// 1. Start the automation
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-async", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.TINYFISH_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
    goal: "Extract all product data",
  }),
});

const { run_id } = await response.json();

// 2. Poll for the result
const response = await fetch(`https://agent.tinyfish.ai/v1/runs/${run_id}`, {
  headers: { "X-API-Key": process.env.TINYFISH_API_KEY },
});

const run = await response.json();
// run.status: PENDING, RUNNING, COMPLETED, FAILED, or CANCELLED
// run.result: Your data (when COMPLETED)
```

```typescript
// 3. Cancel a run (optional)
await fetch(`https://agent.tinyfish.ai/v1/runs/${run_id}/cancel`, {
  method: "POST",
  headers: { "X-API-Key": process.env.TINYFISH_API_KEY },
});
```

--------------------------------

### Cancel a Tinyfish AI SSE Run

Source: https://docs.tinyfish.ai/key-concepts/endpoints

This snippet shows how to cancel an ongoing streaming run using the `runId` obtained from a `STARTED` event. It makes a POST request to the cancel endpoint with the necessary API key.

```typescript
await fetch(`https://agent.tinyfish.ai/v1/runs/${runId}/cancel`, {
  method: "POST",
  headers: { "X-API-Key": process.env.TINYFISH_API_KEY },
});
```

--------------------------------

### Parse Infrastructure Failure Response from TinyFish Web Agent

Source: https://docs.tinyfish.ai/ai-integration

Understand the JSON response when the TinyFish Web Agent's browser infrastructure itself fails. This may require retrying the operation, possibly with different settings.

```json
{
  "status": "FAILED",
  "error": {
    "message": "Navigation timeout"
  }
}
```

--------------------------------

### Parse Goal Failure Response from TinyFish Web Agent

Source: https://docs.tinyfish.ai/ai-integration

Interpret the JSON response when the TinyFish Web Agent's browser operations succeed, but the defined goal is not met. This indicates a need for a different approach.

```json
{
  "status": "COMPLETED",
  "result": {
    "success": false,
    "error_type": "not_found",
    "error_message": "No products found on this page"
  }
}
```

--------------------------------

### Handle Tinyfish AI Events

Source: https://docs.tinyfish.ai/key-concepts/endpoints

This code defines a handler for various event types emitted during an automation run. It logs information for `STARTED`, `STREAMING_URL`, and `PROGRESS` events, and handles the `COMPLETE` event by returning the result or throwing an error. The `HEARTBEAT` event requires no action.

```typescript
const eventHandlers = {
  STARTED: (event) => {
    console.log(`Run started: ${event.runId}`);
  },

  STREAMING_URL: (event) => {
    console.log(`Watch live: ${event.streamingUrl}`);
  },

  PROGRESS: (event) => {
    console.log(`Action: ${event.purpose}`);
  },

  COMPLETE: (event) => {
    if (event.status === "COMPLETED") {
      return event.resultJson;
    } else {
      throw new Error(event.error?.message || "Automation failed");
    }
  },

  HEARTBEAT: () => {
    // Connection is alive, no action needed
  },
};
```

--------------------------------

### Run Multiple TinyFish Agents Concurrently (Python)

Source: https://docs.tinyfish.ai/examples/bulk-requests-sync

Executes multiple TinyFish Web Agent runs in parallel using Python's asyncio and aiohttp libraries. This function takes a list of tasks, each with a URL and a goal, and processes them concurrently. It requires the 'aiohttp' library to be installed.

```python
import asyncio
import aiohttp

async def run_tinyfish(session, url, goal):
    """Run a single tinyfish run and return the result"""
    async with session.post(
        "https://agent.tinyfish.ai/v1/automation/run",
        headers={
            "X-API-Key": "YOUR_API_KEY",
            "Content-Type": "application/json",
        },
        json={
            "url": url,
            "goal": goal,
        },
    ) as response:
        result = await response.json()
        return result.get("result")

async def main():
    # Define your batch of tasks - scraping multiple sites
    tasks_to_run = [
        {
            "url": "https://scrapeme.live/shop/",
            "goal": "Extract all available products on page two with their name, price, and review rating (if available)"
        },
        {
            "url": "https://books.toscrape.com/",
            "goal": "Extract all available books on page two with their title, price, and review rating (if available)"
        },
    ]

    # Create session and fire all requests concurrently
    async with aiohttp.ClientSession() as session:
        tasks = [
            run_tinyfish(session, task["url"], task["goal"]) 
            for task in tasks_to_run
        ]

        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks)

        # Process results
        for i, result in enumerate(results):
            print(f"Task {i + 1} result:", result)

# Run the async main function
asyncio.run(main())
```

--------------------------------

### POST /v1/automation/run-sse (Proxy Configuration)

Source: https://docs.tinyfish.ai/examples/scraping

This endpoint enables routing web automation traffic through a specified country's proxy server, useful for accessing geo-restricted content.

```APIDOC
## POST /v1/automation/run-sse (with Proxy)

### Description
Initiates a web automation task, allowing you to configure proxy settings to route traffic through a specific country.

### Method
POST

### Endpoint
https://agent.tinyfish.ai/v1/automation/run-sse

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - The objective of the automation task.
- **browser_profile** (string) - Required - Specifies the browser profile to use (e.g., 'stealth').
- **proxy_config** (object) - Optional - Configuration for proxy usage.
  - **enabled** (boolean) - Required - Whether to enable proxy.
  - **country_code** (string) - Required - The ISO 3166-1 alpha-2 country code for the proxy (e.g., 'US').

### Request Example
```json
{
  "url": "https://geo-restricted-site.com",
  "goal": "Extract data",
  "browser_profile": "stealth",
  "proxy_config": {
    "enabled": true,
    "country_code": "US"
  }
}
```

### Response
#### Success Response (200)
- **stream** (boolean) - Indicates if the response is streamed.
- **data** (object) - Contains the automation results.

#### Response Example
```json
{
  "stream": true,
  "data": {}
}
```
```

--------------------------------

### POST /v1/automation/run-sse

Source: https://docs.tinyfish.ai/examples/form-filling

This endpoint allows you to automate multi-step forms and other web interactions by providing a URL and a detailed goal. It supports various programming languages for integration.

```APIDOC
## POST /v1/automation/run-sse

### Description
This endpoint automates complex web interactions, including multi-step forms, by processing a user-defined goal. It uses Server-Sent Events (SSE) for real-time updates.

### Method
POST

### Endpoint
/v1/automation/run-sse

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website or form to interact with.
- **goal** (string) - Required - A detailed description of the steps to perform, including form field values, button clicks, and desired outcomes.

### Request Example
```json
{
  "url": "https://example.com/signup",
  "goal": "Complete the multi-step signup form:\n\nStep 1 (Personal Info):\n- First name: \"John\"\n- Last name: \"Doe\"\n- Email: \"john@example.com\"\n- Click \"Next\"\n\nStep 2 (Address):\n- Street: \"123 Main St\"\n- City: \"San Francisco\"\n- State: \"CA\"\n- ZIP: \"94102\"\n- Click \"Next\"\n\nStep 3 (Preferences):\n- Select \"Email notifications\" checkbox\n- Click \"Submit\"\n\nExtract the confirmation number from the success page."
}
```

### Response
#### Success Response (200)
- **stream** - The response is a stream of Server-Sent Events (SSE) containing the automation progress and results.

#### Response Example
(SSE Stream - content varies based on automation progress)
```

--------------------------------

### Fetch Documentation Index

Source: https://docs.tinyfish.ai/api-reference/runs/cancel-run-by-id

Retrieve the complete documentation index, which lists all available documentation pages.

```APIDOC
## GET /websites/tinyfish_ai/documentation/index

### Description
Fetch the complete documentation index. Use this file to discover all available pages before exploring further.

### Method
GET

### Endpoint
/websites/tinyfish_ai/documentation/index

### Parameters
#### Query Parameters
None

### Response
#### Success Response (200)
- **documentation_url** (string) - The URL to the documentation index file.

#### Response Example
```json
{
  "documentation_url": "https://docs.tinyfish.ai/llms.txt"
}
```
```

--------------------------------

### Understanding COMPLETED Status

Source: https://docs.tinyfish.ai/key-concepts/runs

Explanation of the `COMPLETED` status, differentiating between infrastructure success and goal success.

```APIDOC
## Understanding COMPLETED Status

`COMPLETED` means the infrastructure worked, not that your goal succeeded. Always check the `result` field.

**Goal succeeded:**

```json
{
  "status": "COMPLETED",
  "result": {
    "products": [
      { "name": "Widget", "price": 29.99 }
    ]
  }
}
```

**Infrastructure worked, goal failed:**

The browser worked fine, but TinyFish Web Agent couldn't achieve your goal.

```json
{
  "status": "COMPLETED",
  "result": {
    "status": "failure",
    "reason": "Could not find any products on the page"
  }
}
```
```

--------------------------------

### POST /v1/automation/run-sse

Source: https://docs.tinyfish.ai/examples/scraping

This endpoint allows you to run web scraping tasks. You provide a URL and a natural language goal, and the API returns the extracted data, often in a streaming format.

```APIDOC
## POST /v1/automation/run-sse

### Description
Extracts data from a given URL based on a natural language goal. Supports streaming responses for real-time data processing.

### Method
POST

### Endpoint
https://agent.tinyfish.ai/v1/automation/run-sse

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to scrape.
- **goal** (string) - Required - A natural language description of the data to extract.

### Request Example
```json
{
  "url": "https://scrapeme.live/shop/Bulbasaur/",
  "goal": "Extract the product name, price, and stock status"
}
```

### Response
#### Success Response (200)
- **type** (string) - The type of the event (e.g., "COMPLETE").
- **status** (string) - The status of the task (e.g., "COMPLETED").
- **resultJson** (object) - The extracted data in JSON format.

#### Response Example
```json
{
  "name": "Bulbasaur",
  "price": 63,
  "inStock": true
}
```
```

--------------------------------

### Documentation Index

Source: https://docs.tinyfish.ai/api-reference/automation/start-automation-asynchronously

Fetch the complete documentation index to discover all available pages for further exploration.

```APIDOC
## GET /websites/tinyfish_ai/documentation/index

### Description
Fetches the complete documentation index for the Tinyfish AI project. This index can be used to discover all available documentation pages.

### Method
GET

### Endpoint
/websites/tinyfish_ai/documentation/index

### Parameters
#### Query Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **documentation_url** (string) - The URL to the documentation index file.

#### Response Example
{
  "documentation_url": "https://docs.tinyfish.ai/llms.txt"
}
```

--------------------------------

### Run SSE Browser Automation (OpenAPI)

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming

This OpenAPI definition describes the `/v1/automation/run-sse` endpoint for the TinyFish AI Web Agent. It allows users to initiate browser automations by providing a target URL and a natural language goal. The endpoint supports SSE streaming for real-time progress updates, browser streaming URLs, and final results. It includes configurations for browser profiles and proxy settings.

```yaml
openapi: 3.0.0
info:
  title: TinyFish Web Agent Automation API
  version: 1.0.0
  description: >-
    REST API for running AI-powered browser automations. Execute tasks on any
    website using natural language instructions.
  contact:
    name: TinyFish Support
    email: support@tinyfish.ai
servers:
  - url: https://tinyfish.ai
    description: Production
security: []
tags:
  - name: Automation
    description: Browser automation endpoints for executing tasks on websites
  - name: Runs
    description: Endpoints for retrieving automation run data
paths:
  /v1/automation/run-sse:
    post:
      tags:
        - Automation
      summary: Run browser automation with SSE streaming
      description: >-
        Execute a browser automation task with Server-Sent Events (SSE)
        streaming. Returns a real-time event stream with automation progress,
        browser streaming URL, and final results.
      operationId: runSse
      requestBody:
        description: Automation task parameters
        content:
          application/json:
            schema:
              type: object
              properties:
                url:
                  type: string
                  format: uri
                  description: Target website URL to automate
                  example: https://example.com
                goal:
                  type: string
                  minLength: 1
                  description: >-
                    Natural language description of what to accomplish on the
                    website
                  example: Find the pricing page and extract all plan details
                browser_profile:
                  type: string
                  enum:
                    - lite
                    - stealth
                  description: >-
                    Browser profile for execution. LITE uses standard browser,
                    STEALTH uses anti-detection browser.
                  example: lite
                proxy_config:
                  type: object
                  properties:
                    enabled:
                      type: boolean
                      description: Enable proxy for this automation run
                      example: true
                    country_code:
                      type: string
                      enum:
                        - US
                        - GB
                        - CA
                        - DE
                        - FR
                        - JP
                        - AU
                      description: ISO 3166-1 alpha-2 country code for proxy location
                      example: US
                  required:
                    - enabled
                  description: Proxy configuration
              required:
                - url
                - goal
      responses:
        '200':
          description: >-
            Server-Sent Events stream. Stream sends STARTED, STREAMING_URL
            (optional), PROGRESS (intermediate events with purpose), COMPLETE
            events, plus periodic HEARTBEAT messages.
          content:
            text/event-stream:
              schema:
                oneOf:
                  - type: object
                    properties:
                      type:
                        type: string
                        enum:
                          - STARTED
                      runId:
                        type: string
                      timestamp:
                        type: string
                    required:
                      - type
                      - runId
                      - timestamp
                  - type: object
                    properties:
                      type:
                        type: string
                        enum:
                          - STREAMING_URL
                      runId:
                        type: string
                      streamingUrl:
                        type: string
                      timestamp:
                        type: string
                    required:
                      - type
                      - runId
                      - streamingUrl
                      - timestamp
                  - type: object
                    properties:
                      type:
                        type: string
                        enum:
                          - COMPLETE
                      runId:
                        type: string
                      status:
                        type: string
                        enum:
                          - COMPLETED
                          - FAILED
                          - CANCELLED
                      error:
                        type: string
                      help_url:
                        type: string
                      help_message:
                        type: string

```

--------------------------------

### POST /v1/automation/run-sse

Source: https://docs.tinyfish.ai/examples/form-filling

Automates form filling and submission on a given URL. This endpoint uses Server-Sent Events (SSE) to stream results.

```APIDOC
## POST /v1/automation/run-sse

### Description
Automates the process of filling and submitting forms on a specified web page. This endpoint is designed to handle complex goals, including filling specific fields, clicking buttons, and extracting information after submission. It utilizes Server-Sent Events (SSE) for real-time progress updates and results.

### Method
POST

### Endpoint
/v1/automation/run-sse

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the web page containing the form to be filled.
- **goal** (string) - Required - A detailed description of the actions to be performed, including field values, button clicks, and desired outcomes.

### Request Example
```json
{
  "url": "https://example.com/contact",
  "goal": "Fill in the contact form:\n        - Name field: \"John Doe\"\n        - Email field: \"john@example.com\"\n        - Message field: \"I am interested in your services.\"\n        Then click the Submit button and extract the success message."
}
```

### Response
#### Success Response (200)
- **type** (string) - The type of event (e.g., 'COMPLETE').
- **status** (string) - The status of the event (e.g., 'COMPLETED').
- **resultJson** (object) - A JSON object containing the result of the automation task.

#### Response Example
```json
{
  "success": true,
  "message": "Thank you for contacting us!"
}
```
```

--------------------------------

### POST /v1/automation/run

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-synchronously

Execute a browser automation task synchronously and wait for completion. Returns the final result once the automation finishes (success or failure).

```APIDOC
## POST /v1/automation/run

### Description
Execute a browser automation task synchronously and wait for completion. Returns the final result once the automation finishes (success or failure). Use this endpoint when you need the complete result in a single response.

### Method
POST

### Endpoint
/v1/automation/run

### Parameters
#### Query Parameters
- **url** (string) - Required - Target website URL to automate
- **goal** (string) - Required - Natural language description of what to accomplish on the website
- **browser_profile** (string) - Optional - Browser profile for execution. LITE uses standard browser, STEALTH uses anti-detection browser. Enum: ["lite", "stealth"]
- **proxy_config** (object) - Optional - Proxy configuration
  - **enabled** (boolean) - Required - Enable proxy for this automation run
  - **country_code** (string) - Optional - ISO 3166-1 alpha-2 country code for proxy location. Enum: ["US", "GB", "CA", "DE", "FR", "JP", "AU"]

### Request Example
```json
{
  "url": "https://example.com",
  "goal": "Find the pricing page and extract all plan details",
  "browser_profile": "lite",
  "proxy_config": {
    "enabled": true,
    "country_code": "US"
  }
}
```

### Response
#### Success Response (200)
- **run_id** (string) - Unique identifier for the automation run
- **status** (string) - Final status of the automation run. Enum: ["COMPLETED", "FAILED"]
- **started_at** (string) - ISO 8601 timestamp when the run started
- **finished_at** (string) - ISO 8601 timestamp when the run finished
- **num_of_steps** (number) - Number of steps taken during the automation
- **result** (object) - Structured JSON result extracted from the automation. Null if the run failed.
- **error** (object) - Error details if the run failed
  - **message** (string) - Error message

#### Response Example
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "COMPLETED",
  "started_at": "2024-01-01T00:00:00Z",
  "finished_at": "2024-01-01T00:00:30Z",
  "num_of_steps": 5,
  "result": {
    "product": "iPhone 15",
    "price": "$799"
  },
  "error": null
}
```
```

--------------------------------

### Run Web Automation (Synchronous)

Source: https://docs.tinyfish.ai/mcp-integration

Execute web automation tasks synchronously. This tool is suitable for interactive use as it streams progress in real-time. It requires a URL, a goal description, and optionally a browser profile and proxy configuration.

```json
{
  "tool_code": "run_web_automation",
  "url": "https://example.com",
  "goal": "Extract product prices"
}
```

--------------------------------

### Run Object Structure

Source: https://docs.tinyfish.ai/key-concepts/runs

Details about the structure of a Run object returned when fetching a run.

```APIDOC
## Run Object Structure

When you fetch a run, you get back the following object:

```json
{
  "run_id": "abc123",
  "status": "COMPLETED",
  "result": { ... },
  "error": null,
  "streamingUrl": "https://stream.mino.ai/session/abc123"
}
```

### Fields

- **run_id** (string) - Unique identifier for this run.
- **status** (string) - Current lifecycle status (`PENDING`, `RUNNING`, `COMPLETED`, `FAILED`, `CANCELLED`).
- **result** (object) - Your extracted data (when `COMPLETED` and goal succeeded).
- **error** (object) - Error details (when `FAILED`).
- **streamingUrl** (string) - URL to watch the browser live.
```

--------------------------------

### Run Browser Automation with SSE Streaming (cURL)

Source: https://docs.tinyfish.ai/api-reference

This snippet demonstrates how to initiate a browser automation task using the Tinyfish.ai API with Server-Sent Events (SSE) streaming. It requires an API key and specifies the target URL, the desired goal, and browser profile. The response is an SSE stream providing real-time updates on the task's progress.

```cURL
curl --request POST \
  --url https://tinyfish.ai/v1/automation/run-sse \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: <api-key>' \
  --data '
{
  "url": "https://example.com",
  "goal": "Find the pricing page and extract all plan details",
  "browser_profile": "lite",
  "proxy_config": {
    "enabled": true,
    "country_code": "US"
  }
}
'
```

--------------------------------

### Proxy Configuration

Source: https://docs.tinyfish.ai/faq

Shows how to configure proxy settings for web automations using the TinyFish Web Agent API. This includes enabling proxies and specifying a country code for routing.

```typescript
{
  proxy_config: {
    enabled: true,
    country_code: "US"
  }
}
```

--------------------------------

### POST /v1/automation/run-sse (Stealth Mode)

Source: https://docs.tinyfish.ai/examples/scraping

This endpoint allows you to run web automation tasks, including using 'stealth' browser profiles to bypass bot protection on websites.

```APIDOC
## POST /v1/automation/run-sse

### Description
Initiates a web automation task using the Tinyfish AI agent. This example demonstrates how to enable 'stealth' mode to handle websites with bot protection.

### Method
POST

### Endpoint
https://agent.tinyfish.ai/v1/automation/run-sse

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - The objective of the automation task (e.g., 'Extract product data').
- **browser_profile** (string) - Required - Specifies the browser profile to use. Use 'stealth' for bot protection.

### Request Example
```json
{
  "url": "https://protected-site.com",
  "goal": "Extract product data",
  "browser_profile": "stealth"
}
```

### Response
#### Success Response (200)
- **stream** (boolean) - Indicates if the response is streamed.
- **data** (object) - Contains the automation results.

#### Response Example
```json
{
  "stream": true,
  "data": {}
}
```
```

--------------------------------

### Run Automation via SSE

Source: https://docs.tinyfish.ai/index

This endpoint allows you to run an automation task using Server-Sent Events (SSE) for real-time streaming of results. You provide a URL and a goal, and the agent will execute the task and stream the output.

```APIDOC
## POST /v1/automation/run-sse

### Description
Runs an automation task and streams results in real-time using Server-Sent Events (SSE).

### Method
POST

### Endpoint
https://agent.tinyfish.ai/v1/automation/run-sse

### Parameters
#### Headers
- **X-API-Key** (string) - Required - Your TinyFish API key.
- **Content-Type** (string) - Required - Must be `application/json`.

#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - A natural language description of the task to perform.

### Request Example
```json
{
  "url": "https://scrapeme.live/shop",
  "goal": "Extract the first 2 product names and prices. Respond in json"
}
```

### Response
#### Success Response (200)
- **type** (string) - The type of the event (e.g., "COMPLETE").
- **status** (string) - The status of the task (e.g., "COMPLETED").
- **resultJson** (object) - The structured JSON result of the automation.
  - **products** (array) - List of products extracted.
    - **name** (string) - The name of the product.
    - **price** (string) - The price of the product.
    - **inStock** (boolean) - Whether the product is in stock.

#### Response Example
```json
{
  "type": "COMPLETE",
  "status": "COMPLETED",
  "resultJson": {
    "products": [
      { "name": "Laptop Pro", "price": "$1,299", "inStock": true },
      { "name": "Wireless Mouse", "price": "$29", "inStock": true }
    ]
  }
}
```
```

--------------------------------

### Fetch All Runs

Source: https://docs.tinyfish.ai/examples/bulk-requests-async

Retrieve a list of all submitted runs to monitor batch progress.

```APIDOC
## GET /v1/runs

### Description
Retrieve a list of all submitted runs. This endpoint is useful for monitoring the overall progress of multiple asynchronous tasks and identifying the status of each run in a batch.

### Method
GET

### Endpoint
/v1/runs

### Parameters
#### Query Parameters
- **status** (string) - Optional - Filter runs by their status (e.g., 'pending', 'completed', 'failed').
- **limit** (integer) - Optional - The maximum number of runs to return.
- **offset** (integer) - Optional - The number of runs to skip before returning results.

### Response
#### Success Response (200)
- **runs** (array) - Description: A list of run objects.
  - **run_object** (object) - Description: Details of a single run.
    - **run_id** (string) - Description: The unique identifier of the run.
    - **status** (string) - Description: The current status of the run.
    - **created_at** (string) - Description: Timestamp when the run was created.

#### Response Example
```json
{
  "runs": [
    {
      "run_id": "run_abc123",
      "status": "completed",
      "created_at": "2023-10-27T10:00:00Z"
    },
    {
      "run_id": "run_def456",
      "status": "processing",
      "created_at": "2023-10-27T10:05:00Z"
    }
  ]
}
```
```

--------------------------------

### Automate Form Filling with Tinyfish AI

Source: https://docs.tinyfish.ai/examples/form-filling

This snippet demonstrates how to use the Tinyfish AI agent API to fill and submit a web form. It sends a POST request with the target URL and a detailed goal describing the form fields and actions. The response is streamed and parsed to extract the completion message.

```TypeScript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://example.com/contact",
      goal: `Fill in the contact form:
        - Name field: "John Doe"
        - Email field: "john@example.com"
        - Message field: "I am interested in your services."
        Then click the Submit button and extract the success message.
      `,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const event = JSON.parse(line.slice(6));

        if (event.type === "COMPLETE" && event.status === "COMPLETED") {
          console.log("Result:", event.resultJson);
        }
      }
    }
  }
```

```Python
import requests
import json

response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run-sse",
    headers={
        "X-API-Key": api_key,
        "Content-Type": "application/json",
    },
    json={
        "url": "https://example.com/contact",
        "goal": """Fill in the contact form:
            - Name field: \"John Doe\"
            - Email field: \"john@example.com\"
            - Message field: \"I am interested in your services.\"
            Then click the Submit button and extract the success message.
        """,
    },
    stream=True,
)

for line in response.iter_lines():
    if line:
        line_str = line.decode("utf-8")
        if line_str.startswith("data: "): 
            event = json.loads(line_str[6:])

            if event.get("type") == "COMPLETE" and event.get("status") == "COMPLETED":
                print("Result:", event["resultJson"])

```

```cURL
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ 
    "url": "https://example.com/contact",
    "goal": "Fill in the contact form with name John Doe and email john@example.com, then click Submit"
  }'
```

--------------------------------

### Authentication

Source: https://docs.tinyfish.ai/api-reference/automation/start-automation-asynchronously

This API uses an API key for authentication, which should be included in the 'X-API-Key' header for all requests.

```APIDOC
## Authentication

### Description
API key for authentication. Get your key from the API Keys page.

### Method
All Methods

### Endpoint
All Endpoints

### Parameters
#### Header Parameters
- **X-API-Key** (string) - Required - API key for authentication.
```

--------------------------------

### Handling Run Results

Source: https://docs.tinyfish.ai/key-concepts/runs

A TypeScript pattern for handling both infrastructure and goal failures in run results.

```APIDOC
## Handling Run Results

Use this pattern to handle both infrastructure failures and goal failures in your code.

```typescript
async function handleTinyFishResponse(run: TinyFishRun) {
  switch (run.status) {
    case "COMPLETED":
      if (!run.result) {
        return { success: false, error: "No result returned" };
      }

      // Check for goal-level failure in result
      if (run.result.status === "failure" || run.result.error) {
        return {
          success: false,
          error: run.result.reason || run.result.error || "Goal not achieved",
        };
      }

      return { success: true, data: run.result };

    case "FAILED":
      return {
        success: false,
        error: run.error?.message || "Automation failed",
        retryable: true,
      };

    case "CANCELLED":
      return { success: false, error: "Run was cancelled" };

    default:
      return { success: false, error: `Unexpected status: ${run.status}` };
  }
}
```
```

--------------------------------

### Security Best Practices

Source: https://docs.tinyfish.ai/authentication

Recommendations for securely using the Tinyfish AI API, including key management and usage monitoring.

```APIDOC
## Security Best Practices

*   **Use Environment Variables:** Never hardcode API keys in source code.
*   **Rotate Keys Regularly:** Regenerate keys periodically and after team changes.
*   **Limit Exposure:** Use separate keys for development and production.
*   **Monitor Usage:** Review API usage in your dashboard for anomalies.
```

--------------------------------

### run_web_automation

Source: https://docs.tinyfish.ai/mcp-integration

Executes web automation and streams progress in real-time. Suitable for interactive use.

```APIDOC
## POST /run_web_automation

### Description
Executes web automation and streams progress in real-time. Best for interactive use where you want to see what's happening.

### Method
POST

### Endpoint
`/run_web_automation`

### Parameters
#### Query Parameters
- **url** (string) - Required - Target website URL
- **goal** (string) - Required - Natural language description of what to do
- **browser_profile** (string) - Optional - `lite` (default) or `stealth` for anti-detection
- **proxy_config** (object) - Optional - Proxy settings with `enabled` and `country_code`
  - **enabled** (boolean) - Required - Whether the proxy is enabled
  - **country_code** (string) - Optional - The country code for the proxy

### Request Example
```json
{
  "url": "https://example.com",
  "goal": "Extract the product prices",
  "browser_profile": "stealth",
  "proxy_config": {
    "enabled": true,
    "country_code": "US"
  }
}
```

### Response
#### Success Response (200)
- **output** (string) - The streamed output of the web automation process.

#### Response Example
```json
{
  "output": "Navigating to https://example.com..."
}
```
```

--------------------------------

### list_runs

Source: https://docs.tinyfish.ai/mcp-integration

Lists automation runs with optional filtering and pagination.

```APIDOC
## GET /runs

### Description
Lists your automation runs with optional filtering and pagination.

### Method
GET

### Endpoint
`/runs`

### Parameters
#### Query Parameters
- **status** (string) - Optional - Filter by status: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED
- **cursor** (string) - Optional - Pagination cursor from previous response
- **limit** (number) - Optional - Max results (1-100, default 20)

### Response
#### Success Response (200)
- **runs** (array) - A list of automation runs.
- **next_cursor** (string | null) - A cursor for fetching the next page of results, or null if there are no more pages.

#### Response Example
```json
{
  "runs": [
    {
      "run_id": "abc123-...",
      "status": "COMPLETED",
      "goal": "Extract product prices"
    }
  ],
  "next_cursor": "some-cursor-string"
}
```
```

--------------------------------

### POST /v1/automation/run-async

Source: https://docs.tinyfish.ai/common-patterns

Submits asynchronous web automation tasks for batch processing. This endpoint allows submitting multiple tasks at once and then polling for their completion, which is efficient for handling numerous URLs without blocking.

```APIDOC
## POST /v1/automation/run-async

### Description
Submits asynchronous web automation tasks for batch processing. This endpoint allows submitting multiple tasks at once and then polling for their completion, which is efficient for handling numerous URLs without blocking.

### Method
POST

### Endpoint
/v1/automation/run-async

### Parameters
#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The URL of the website to process.
- **goal** (string) - Required - The objective for the automation.

### Request Example
```json
{
  "url": "https://example.com/page1",
  "goal": "Extract title and meta description"
}
```

### Response
#### Success Response (200)
- **run_id** (string) - A unique identifier for the submitted automation task.

#### Response Example
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```
```

--------------------------------

### Use Explicit Fallbacks for Multi-Layout Pages

Source: https://docs.tinyfish.ai/prompting-guide

Define a sequence of approaches to extract information when the page layout may vary. This ensures data extraction succeeds even if the primary method fails, by checking alternative locations.

```text
Extract the product price from this page.

Primary approach: Look for the price in the main product details section.
If not found: Check the "Buy Box" sidebar on the right.
If still not found: Look for a "See price in cart" button.

Return:
{
  "price": number or null,
  "price_location": "main" or "sidebar" or "cart_required" or "not_found"
}
```

--------------------------------

### POST /v1/automation/run-sse (Streaming)

Source: https://docs.tinyfish.ai/key-concepts/endpoints

Initiates an automation that streams results using Server-Sent Events (SSE). Ideal for real-time progress updates and user-facing applications.

```APIDOC
## POST /v1/automation/run-sse

### Description
Initiates an automation that streams results using Server-Sent Events (SSE). This endpoint pushes updates in real-time, allowing you to monitor the automation's progress live. Best for user-facing applications needing live feedback.

### Method
POST

### Endpoint
/v1/automation/run-sse

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - The objective for the automation.

### Request Example
```json
{
  "url": "https://example.com",
  "goal": "Extract all product data"
}
```

### Response
#### Success Response (200)
- The response is a Server-Sent Events stream. Each event contains data about the automation's progress.

#### Response Example (Event Stream)
```
data: {"type": "action", "action": "navigate", "url": "https://example.com"}

data: {"type": "action", "action": "extract", "data": {"title": "Example Domain"}}

data: {"type": "run_completed", "result": {"title": "Example Domain"}}
```
```

--------------------------------

### Proxy Configuration

Source: https://docs.tinyfish.ai/key-concepts/proxies

Configure proxy settings by adding the `proxy_config` object to your request. Specify the country code for the desired proxy location.

```APIDOC
## POST /api/websites/tinyfish_ai

### Description
Send a request to the Tinyfish AI Web Agent, optionally routing it through a specified country using proxy settings.

### Method
POST

### Endpoint
/api/websites/tinyfish_ai

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to visit.
- **goal** (string) - Required - The objective for the web agent.
- **proxy_config** (object) - Optional - Configuration for proxy usage.
  - **enabled** (boolean) - Required - Set to `true` to enable proxy.
  - **country_code** (string) - Required - The ISO 3166-1 alpha-2 country code (e.g., `US`, `GB`, `CA`).
- **browser_profile** (string) - Optional - Specifies the browser profile to use (e.g., `stealth`).

### Request Example
```json
{
  "url": "https://example.com",
  "goal": "Extract product data",
  "proxy_config": {
    "enabled": true,
    "country_code": "US"
  }
}
```

### Response
#### Success Response (200)
- **result** (string) - The outcome of the web agent's task.

#### Response Example
```json
{
  "result": "Product data extracted successfully."
}
```
```

--------------------------------

### Describe Elements Visually for Interaction

Source: https://docs.tinyfish.ai/prompting-guide

Provide visual cues to identify elements when unique identifiers are not available. This allows the agent to interact with the page based on its appearance, such as color or position relative to other elements.

```text
Click the blue "Add to Cart" button below the price
```

--------------------------------

### Handle Edge Cases for Price Extraction

Source: https://docs.tinyfish.ai/prompting-guide

Implement logic to manage scenarios where data might be missing or unavailable. This includes returning specific values for out-of-stock items or when a price cannot be found.

```text
Extract the price from the product page.
If the product is out of stock, return { "price": null, "outOfStock": true }.
If no price is found, return { "price": null, "error": "Price not found" }.
```

--------------------------------

### Run Web Automation (Asynchronous)

Source: https://docs.tinyfish.ai/mcp-integration

Initiate web automation tasks asynchronously. This function returns a run ID immediately, allowing for long-running tasks without blocking. Parameters are similar to the synchronous version.

```json
{
  "tool_code": "run_web_automation_async",
  "url": "https://store.com",
  "goal": "Extract all products"
}
```

--------------------------------

### POST /v1/automation/run (Synchronous)

Source: https://docs.tinyfish.ai/key-concepts/endpoints

Executes an automation synchronously. The API call blocks until the automation completes and returns the result directly.

```APIDOC
## POST /v1/automation/run

### Description
Executes an automation synchronously. The API call blocks until the automation completes and returns the result directly. This is best for quick tasks and simple integrations.

### Method
POST

### Endpoint
/v1/automation/run

### Parameters
#### Request Body
- **url** (string) - Required - The URL of the website to automate.
- **goal** (string) - Required - The objective for the automation.

### Request Example
```json
{
  "url": "https://example.com",
  "goal": "Extract the page title"
}
```

### Response
#### Success Response (200)
- **result** (any) - The result of the automation.

#### Response Example
```json
{
  "result": "Example Domain"
}
```
```

--------------------------------

### Configure Proxy for Web Agent Request (TypeScript)

Source: https://docs.tinyfish.ai/key-concepts/proxies

This snippet demonstrates how to configure proxy settings for a TinyFish Web Agent request. It includes enabling the proxy and specifying the desired country code. This is useful for accessing geo-restricted content.

```typescript
{
  url: "https://example.com",
  goal: "Extract product data",
  proxy_config: {
    enabled: true,
    country_code: "US"
  }
}
```

--------------------------------

### Advanced Usage: Retry with Stealth Mode

Source: https://docs.tinyfish.ai/common-patterns

Demonstrates how to implement a fallback mechanism to retry automation tasks using 'stealth' browser profiles and proxy configurations if the initial attempt is blocked by the website.

```APIDOC
## Advanced Usage: Retry with Stealth Mode

### Description
This pattern shows how to handle websites that block automated requests. It first attempts the task using a 'lite' browser profile for speed. If the request is blocked, it automatically retries with a 'stealth' browser profile and proxy enabled for a higher chance of success.

### Method
POST (Implicitly via `runAutomation` calls)

### Endpoint
/v1/automation/run (or similar internal endpoint used by `runAutomation`)

### Parameters
- **url** (string) - Required - The URL to automate.
- **goal** (string) - Required - The objective of the automation.
- **options** (object) - Optional - Configuration for the browser profile and proxy.
  - **browser_profile** (string) - Optional - Specifies the browser profile to use (e.g., 'lite', 'stealth'). Defaults to standard.
  - **proxy_config** (object) - Optional - Configuration for proxy usage.
    - **enabled** (boolean) - Required - Whether to enable the proxy.
    - **country_code** (string) - Optional - The country code for the proxy server.

### Request Example (Conceptual)
```typescript
async function extractWithFallback(url: string, goal: string) {
  // Try standard mode first
  let result = await runAutomation(url, goal, { browser_profile: "lite" });

  if (result.status === "FAILED" && result.error?.message.includes("blocked")) {
    // Retry with stealth mode
    result = await runAutomation(url, goal, {
      browser_profile: "stealth",
      proxy_config: { enabled: true, country_code: "US" },
    });
  }

  return result;
}
```

### Response
- **status** (string) - The final status of the automation run ('COMPLETED' or 'FAILED').
- **result** (object) - The extracted data if successful.
- **error** (object) - Error details if the run failed.
```

--------------------------------

### Event Types and Handling

Source: https://docs.tinyfish.ai/key-concepts/endpoints

Defines the different event types emitted during an automation run and provides a pattern for handling them.

```APIDOC
## Event Types

### Description
These are the event types that can be received during an automation run, providing real-time updates on its progress.

| Event           | Description                                             |
| --------------- | ------------------------------------------------------- |
| `STARTED`       | Automation has begun, includes `runId`                  |
| `STREAMING_URL` | URL to watch the browser live (valid 24hrs)             |
| `PROGRESS`      | Browser action taken (click, type, scroll, etc.)        |
| `HEARTBEAT`     | Connection keep-alive (no action needed)                |
| `COMPLETE`      | Automation finished, includes `status` and `resultJson` |

### Handling Events
Use this pattern to process each event type as the automation progresses.

```typescript
const eventHandlers = {
  STARTED: (event) => {
    console.log(`Run started: ${event.runId}`);
  },

  STREAMING_URL: (event) => {
    console.log(`Watch live: ${event.streamingUrl}`);
  },

  PROGRESS: (event) => {
    console.log(`Action: ${event.purpose}`);
  },

  COMPLETE: (event) => {
    if (event.status === "COMPLETED") {
      return event.resultJson;
    }
    throw new Error(event.error?.message || "Automation failed");
  },

  HEARTBEAT: () => {
    // Connection is alive, no action needed
  },
};
```

### When to Use Event Streaming
- User-facing applications to display progress.
- When real-time monitoring of the browser is needed.
- For debugging and development purposes.
- Long-running tasks that require visibility into their execution.

### When to Avoid Event Streaming
- Batch processing scenarios where real-time updates are not critical.
- Backend jobs that do not require progress visibility.
```

--------------------------------

### Configure TinyFish MCP Server for Claude Desktop (JSON)

Source: https://docs.tinyfish.ai/mcp-integration

Add TinyFish MCP server configuration to your Claude Desktop settings. This allows your assistant to connect to TinyFish for web browsing. Ensure you restart Claude Desktop after modifying the configuration file.

```json
{
  "mcpServers": {
    "tinyfish": {
      "url": "https://agent.tinyfish.ai/mcp"
    }
  }
}
```

--------------------------------

### Submit Async Bulk Requests

Source: https://docs.tinyfish.ai/examples/bulk-requests-async

Submit multiple runs asynchronously and receive run IDs for later polling.

```APIDOC
## POST /v1/automation/run-async

### Description
Submit multiple automation runs asynchronously. This endpoint is suitable for scenarios where you need to initiate several long-running tasks without waiting for each to complete individually. It returns a list of unique `run_id`s that can be used to track the status and retrieve results of each submitted run.

### Method
POST

### Endpoint
/v1/automation/run-async

### Parameters
#### Request Body
- **runs** (array) - Required - An array of run objects, where each object specifies the parameters for an individual run.
  - **run_object** (object) - Required - Represents a single run configuration.
    - **model** (string) - Required - The model to use for the run.
    - **prompt** (string) - Required - The prompt to execute.
    - **temperature** (number) - Optional - The temperature for sampling.
    - **max_tokens** (integer) - Optional - The maximum number of tokens to generate.
    - **other_parameters** (object) - Optional - Additional parameters specific to the model or task.

### Request Example
```json
{
  "runs": [
    {
      "model": "gpt-3.5-turbo",
      "prompt": "Translate 'hello world' to French.",
      "temperature": 0.7,
      "max_tokens": 50
    },
    {
      "model": "gpt-4",
      "prompt": "Summarize the following text: ...",
      "temperature": 0.5
    }
  ]
}
```

### Response
#### Success Response (200)
- **run_ids** (array) - Description: A list of unique identifiers for each submitted run.
  - **run_id** (string) - Description: The unique identifier for a specific run.

#### Response Example
```json
{
  "run_ids": [
    "run_abc123",
    "run_def456"
  ]
}
```
```

--------------------------------

### API Authentication Header

Source: https://docs.tinyfish.ai/faq

Demonstrates how to authenticate with the TinyFish Web Agent REST API using the X-API-Key header. This is essential for making authorized requests to the API.

```text
X-API-Key: $TINYFISH_API_KEY
```

--------------------------------

### POST /v1/automation/run

Source: https://docs.tinyfish.ai/common-patterns

Performs a synchronous web automation task to extract data from a given URL based on a specified goal. This is suitable for quick, one-off extractions where an immediate result is needed.

```APIDOC
## POST /v1/automation/run

### Description
Performs a synchronous web automation task to extract data from a given URL based on a specified goal. This is suitable for quick, one-off extractions where an immediate result is needed.

### Method
POST

### Endpoint
/v1/automation/run

### Parameters
#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The URL of the website to process.
- **goal** (string) - Required - The objective for the automation, e.g., "Extract all product names and prices. Return as JSON."

### Request Example
```json
{
  "url": "https://example.com/products",
  "goal": "Extract all product names and prices. Return as JSON."
}
```

### Response
#### Success Response (200)
- **status** (string) - The status of the automation run (e.g., "COMPLETED").
- **result** (object) - The extracted data, typically in JSON format, as specified by the goal.

#### Response Example
```json
{
  "status": "COMPLETED",
  "result": [
    {
      "name": "Product A",
      "price": "$10.00"
    },
    {
      "name": "Product B",
      "price": "$20.00"
    }
  ]
}
```
```

--------------------------------

### Configure Lite Browser Profile for Standard Websites

Source: https://docs.tinyfish.ai/key-concepts/browser-profiles

The 'lite' browser profile is used for standard websites without bot protection. It is the default profile if none is specified. This configuration sets the URL and the goal for the web agent.

```typescript
{
  url: "https://example.com",
  goal: "Extract product data",
  browser_profile: "lite"
}
```

--------------------------------

### Scraping Authenticated Content

Source: https://docs.tinyfish.ai/faq

Illustrates how to instruct TinyFish Web Agent to scrape content from authenticated sections of a website. This involves including login steps within the goal description.

```typescript
goal: `
      1. Login with username "user@example.com" and password "pass123"
      2. Navigate to dashboard
      3. Extract account balance
    `
```

--------------------------------

### Project Status

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-synchronously

Retrieves the status of a project, including any infrastructure errors that occurred before run creation.

```APIDOC
## GET /websites/tinyfish_ai

### Description
Retrieves the status of a project, including details about infrastructure errors that may have occurred before run creation.

### Method
GET

### Endpoint
/websites/tinyfish_ai

### Parameters
#### Query Parameters
- **project_id** (string) - Required - The unique identifier for the project.

### Request Example
```
GET /websites/tinyfish_ai?project_id=your_project_id
```

### Response
#### Success Response (200)
- **run_id** (string or null) - The ID of the run, or null if no run was created.
- **status** (string) - The status of the project ('FAILED', 'SUCCESS', etc.).
- **started_at** (string or null) - Timestamp when the project started.
- **finished_at** (string or null) - Timestamp when the project finished.
- **num_of_steps** (integer) - The number of steps in the project.
- **result** (object or null) - The result of the project run.
- **error** (object or null) - Details about any errors encountered.
  - **message** (string) - The error message.

#### Response Example
```json
{
  "run_id": null,
  "status": "FAILED",
  "started_at": null,
  "finished_at": null,
  "num_of_steps": 0,
  "result": null,
  "error": {
    "message": "Internal server error"
  }
}
```
```

--------------------------------

### List Automation Runs

Source: https://docs.tinyfish.ai/mcp-integration

List all your web automation runs with options for filtering by status and pagination. This helps in managing and reviewing past automation tasks. You can filter by status (PENDING, RUNNING, COMPLETED, FAILED, CANCELLED) and control the number of results.

```json
{
  "tool_code": "list_runs",
  "status": "FAILED"
}
```

--------------------------------

### Run Web Automation via SSE (cURL)

Source: https://docs.tinyfish.ai/index

This snippet demonstrates how to run a web automation task using the TinyFish Web Agent API via cURL. It sends a POST request with a JSON payload specifying the URL and the desired goal for the automation. The response is streamed in real-time using Server-Sent Events (SSE).

```curl
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ \
    "url": "https://scrapeme.live/shop", \
    "goal": "Extract the first 2 product names and prices. Respond in json" \
  }'
```

--------------------------------

### Add TinyFish MCP Server via Claude CLI (Bash)

Source: https://docs.tinyfish.ai/mcp-integration

Use the Claude command-line interface to add the TinyFish MCP server. This command registers the TinyFish agent with an HTTP transport, making it available for use with Claude.

```bash
claude mcp add --transport http tinyfish https://agent.tinyfish.ai/mcp
```

--------------------------------

### POST /v1/runs/{id}/cancel

Source: https://docs.tinyfish.ai/key-concepts/runs

Cancel a run that is `PENDING` or `RUNNING` by sending a POST request to this endpoint.

```APIDOC
## POST /v1/runs/{id}/cancel

### Description

You can cancel a run that is `PENDING` or `RUNNING` by sending a POST request to `/v1/runs/{id}/cancel`. This works for runs created via `/run-async` or `/run-sse` only.

### Method

POST

### Endpoint

`/v1/runs/{id}/cancel`

### Parameters

#### Path Parameters

- **id** (string) - Required - The unique identifier of the run to cancel.

#### Headers

- **X-API-Key** (string) - Required - Your TinyFish API key.

### Request Example

```typescript
const response = await fetch(`https://agent.tinyfish.ai/v1/runs/${runId}/cancel`, {
  method: "POST",
  headers: {
    "X-API-Key": process.env.TINYFISH_API_KEY,
  },
});

const result = await response.json();
```

### Response

#### Success Response (200)

The response indicates the final status of the run after the cancellation attempt.

- **status** (string) - The final status of the run (`CANCELLED`, `COMPLETED`, or `FAILED`).
- **cancelled_at** (timestamp | null) - Timestamp if the run was successfully cancelled.
- **message** (string | null) - Additional context (e.g. "Run already cancelled", "Run already finished").

#### Response Examples

**Run cancelled:**

```json
{
  "status": "CANCELLED",
  "cancelled_at": "2023-10-27T10:00:00Z",
  "message": null
}
```

**Already cancelled:**

```json
{
  "status": "CANCELLED",
  "cancelled_at": "2023-10-27T09:55:00Z",
  "message": "Run already cancelled"
}
```

**Already completed:**

```json
{
  "status": "COMPLETED",
  "cancelled_at": null,
  "message": "Run already finished"
}
```

### Notes

The cancel endpoint is **idempotent** — calling it on an already-cancelled or completed run returns the current state without error.

Only runs created via the API (`/run-async` or `/run-sse`) can be cancelled using this endpoint. Runs created through the dashboard UI or via the synchronous `/run` endpoint cannot be cancelled.
```

--------------------------------

### Run browser automation synchronously

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-synchronously

Execute a browser automation task synchronously and wait for completion. Returns the final result once the automation finishes (success or failure). Use this endpoint when you need the complete result in a single response.

```APIDOC
## POST /websites/tinyfish_ai/run

### Description
Execute a browser automation task synchronously and wait for completion. Returns the final result once the automation finishes (success or failure). Use this endpoint when you need the complete result in a single response.

### Method
POST

### Endpoint
/websites/tinyfish_ai/run

### Parameters
#### Request Body
- **task_id** (string) - Required - The ID of the browser automation task to execute.
- **parameters** (object) - Optional - Additional parameters for the task execution.

### Request Example
```json
{
  "task_id": "task_123",
  "parameters": {
    "url": "https://example.com"
  }
}
```

### Response
#### Success Response (200)
- **status** (string) - The status of the task execution (e.g., "completed", "failed").
- **result** (object) - The result of the browser automation task.

#### Response Example
```json
{
  "status": "completed",
  "result": {
    "title": "Example Domain",
    "content": "<h1>Example Domain</h1>"
  }
}
```
```

--------------------------------

### Automation Run Response (500 Server Error)

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-synchronously

Details the response format for server errors during automation execution, including run details, status, timestamps, and error information.

```APIDOC
## Automation Run Response (500 Server Error)

### Description
Represents the response from an automation run. It includes details about the run's status, timing, steps, results, and any errors encountered. This is typically returned for server errors or when automation fails.

### Method
N/A (This describes a response format, not a specific endpoint)

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200) - Note: While the schema is for a 500 error, the structure applies to successful runs as well, with `result` populated and `error` null.
- **run_id** (string) - Required - Unique identifier for the automation run.
- **status** (string) - Required - Final status of the automation run (COMPLETED or FAILED).
- **started_at** (string) - Required - ISO 8601 timestamp when the run started.
- **finished_at** (string) - Required - ISO 8601 timestamp when the run finished.
- **num_of_steps** (number) - Required - Number of steps taken during the automation.
- **result** (object) - Optional - Structured JSON result extracted from the automation. Null if the run failed.
- **error** (object) - Optional - Error details. Null if the run succeeded.
  - **message** (string) - Required - Error message describing why the run failed.
  - **help_url** (string) - Optional - URL to documentation for troubleshooting.
  - **help_message** (string) - Optional - Human-readable help message with guidance.

#### Response Example (Automation Failed)
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "FAILED",
  "started_at": "2024-01-01T00:00:00Z",
  "finished_at": "2024-01-01T00:00:15Z",
  "num_of_steps": 3,
  "result": null,
  "error": {
    "message": "Browser crashed during execution",
    "help_url": "https://docs.mino.ai/prompting-guide",
    "help_message": "Need help? Check out our goal prompting guide for tips and examples."
  }
}
```

#### Response Example (Infrastructure Error)
```json
{
  "run_id": null,
  "status": "FAILED",
  "started_at": null,
  "finished_at": null,
  "num_of_steps": 0,
  "result": null,
  "error": {
    "message": "Internal server error occurred."
  }
}
```
```

--------------------------------

### Synchronous API Call with /run

Source: https://docs.tinyfish.ai/key-concepts/endpoints

Initiates a synchronous automation task using the /run endpoint. The API call blocks until the automation completes and returns the result directly. This is suitable for quick tasks and simple integrations.

```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.TINYFISH_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
    goal: "Extract the page title",
  }),
});

const run = await response.json();
console.log(run.result); // Your data
```

--------------------------------

### Specify Output Format with JSON Structure

Source: https://docs.tinyfish.ai/prompting-guide

Define the desired structure for extracted data by providing a JSON schema. This ensures the agent returns information in a consistent and predictable format, useful for programmatic consumption.

```text
Extract product data. Return as JSON with this structure:
{
  "products": [
    { "name": string, "price": string, "rating": number }
  ]
}
```

--------------------------------

### POST /v1/automation/run-sse

Source: https://docs.tinyfish.ai/api-reference

Initiates a browser automation task and streams progress and results via Server-Sent Events (SSE). This endpoint is suitable for tasks where real-time updates or streaming output is desired.

```APIDOC
## POST /v1/automation/run-sse

### Description
Initiates a browser automation task and streams progress and results via Server-Sent Events (SSE). This endpoint is suitable for tasks where real-time updates or streaming output is desired.

### Method
POST

### Endpoint
/v1/automation/run-sse

### Parameters
#### Header Parameters
- **X-API-Key** (string) - Required - API key for authentication. Get your key from the API Keys page.

#### Request Body
- **url** (string<uri>) - Required - Target website URL to automate. Example: `"https://example.com"`
- **goal** (string) - Required - Natural language description of what to accomplish on the website. Minimum string length: `1`. Example: `"Find the pricing page and extract all plan details"`
- **browser_profile** (enum<string>) - Optional - Browser profile for execution. Available options: `lite`, `stealth`. Example: `"lite"`
- **proxy_config** (object) - Optional - Proxy configuration.
  - **enabled** (boolean) - Optional - Enable proxy. Example: `true`
  - **country_code** (string) - Optional - Proxy country code. Example: `"US"`

### Request Example
```json
{
  "url": "https://example.com",
  "goal": "Find the pricing page and extract all plan details",
  "browser_profile": "lite",
  "proxy_config": {
    "enabled": true,
    "country_code": "US"
  }
}
```

### Response
#### Success Response (200)
- **Content-Type**: `text/event-stream`
- The response is a Server-Sent Events stream. It sends `STARTED`, `STREAMING_URL` (optional), `PROGRESS` (intermediate events with purpose), `COMPLETE` events, plus periodic `HEARTBEAT` messages.

**Event Structure Example:**
```json
data: {"type":"STARTED","runId":"run_123","timestamp":"2025-01-01T00:00:00Z"}

data: {"type":"STREAMING_URL","runId":"run_123","streamingUrl":"https://...","timestamp":"..."}

data: {"type":"PROGRESS","runId":"run_123","purpose":"Clicking submit button","timestamp":"..."}

data: {"type":"COMPLETE","runId":"run_123","status":"COMPLETED","resultJson":{...},"timestamp":"..."}
```

#### Error Responses
- **400**: Bad Request
- **401**: Unauthorized
- **500**: Internal Server Error
```

--------------------------------

### Streaming API Call with /run-sse

Source: https://docs.tinyfish.ai/key-concepts/endpoints

Initiates an automation using the /run-sse endpoint, which utilizes Server-Sent Events (SSE) to stream updates in real-time. This is best for user-facing applications that require live progress feedback.

```typescript
// 1. Start the automation
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.TINYFISH_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
    goal: "Extract all product data",
  }),
});

// 2. Read the event stream
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const text = decoder.decode(value);
  const lines = text.split("\n");

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const event = JSON.parse(line.slice(6));
      console.log(event.type, event);
    }
  }
}
```

--------------------------------

### Web Scraping: Extract Multiple Products (TypeScript, Python, cURL)

Source: https://docs.tinyfish.ai/examples/scraping

Extracts multiple products from a category page, returning their names, prices, and links. This method also utilizes the Tinyfish AI API and requires an API key. The response is streamed and processed to gather data for all listed products.

```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://scrapeme.live/shop/",
      goal: "Extract all products on this page. For each product return: name, price, and link",
    }),
  });
```

```python
response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run-sse",
    headers={
        "X-API-Key": api_key,
        "Content-Type": "application/json",
    },
    json={
        "url": "https://scrapeme.live/shop/",
        "goal": "Extract all products on this page. For each product return: name, price, and link",
    },
    stream=True,
)
```

```curl
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://scrapeme.live/shop/",
    "goal": "Extract all products on this page. For each product return: name, price, and link"
  }'
```

--------------------------------

### Run Object Structure (JSON)

Source: https://docs.tinyfish.ai/key-concepts/runs

The structure of a run object returned when fetching a run. It includes the unique run ID, current status, result data, error details, and a URL for live streaming.

```json
{
  "run_id": "abc123",
  "status": "COMPLETED",
  "result": { ... },
  "error": null,
  "streamingUrl": "https://stream.mino.ai/session/abc123"
}
```

--------------------------------

### Configure Stealth Browser Profile with Proxy

Source: https://docs.tinyfish.ai/key-concepts/browser-profiles

This configuration combines the 'stealth' browser profile with proxy settings for maximum anti-detection. It specifies the URL, goal, browser profile, and enables a proxy with a specific country code.

```typescript
{
  url: "https://protected-site.com",
  goal: "Extract product data",
  browser_profile: "stealth",
  proxy_config: {
    enabled: true,
    country_code: "US"
  }
}
```

--------------------------------

### List Runs

Source: https://docs.tinyfish.ai/api-reference/runs/list-runs

Retrieves a paginated list of automation runs. This endpoint allows you to fetch historical data about your automation processes, including their status, goals, and results.

```APIDOC
## GET /websites/tinyfish_ai/runs

### Description
Retrieves a paginated list of automation runs. This endpoint allows you to fetch historical data about your automation processes, including their status, goals, and results.

### Method
GET

### Endpoint
/websites/tinyfish_ai/runs

### Query Parameters
- **limit** (integer) - Optional - The maximum number of runs to return per page.
- **cursor** (string) - Optional - The cursor for fetching the next page of results.

### Response
#### Success Response (200)
- **data** (array) - An array of run objects.
  - **run_id** (string) - Unique identifier for the run.
  - **status** (string) - The current status of the run (e.g., 'completed', 'failed', 'running').
  - **goal** (string) - The objective of the automation run.
  - **created_at** (string) - Timestamp when the run was created.
  - **started_at** (string) - Timestamp when the run started.
  - **finished_at** (string) - Timestamp when the run finished.
  - **result** (object) - The outcome of the run. Contains details like `goal`, `message`, `error`, `streaming_url`, and `browser_config`.
  - **error** (object) - Error details. Null if the run succeeded or is still running.
  - **streaming_url** (string) - URL to watch live browser session (available while running).
  - **browser_config** (object) - Browser configuration used for the run.
    - **proxy_enabled** (boolean) - Whether proxy was enabled.
    - **proxy_country_code** (string) - Country code for proxy.
- **pagination** (object) - Pagination information.
  - **next_cursor** (string) - Cursor for fetching next page. Null if no more results.
  - **has_more** (boolean) - Whether there are more results after this page.

#### Response Example
```json
{
  "data": [
    {
      "run_id": "run_123",
      "status": "completed",
      "goal": "Scrape product prices from example.com",
      "created_at": "2023-10-27T10:00:00Z",
      "started_at": "2023-10-27T10:01:00Z",
      "finished_at": "2023-10-27T10:05:00Z",
      "result": {
        "goal": "Scrape product prices from example.com",
        "message": "Scraping completed successfully.",
        "error": null,
        "streaming_url": null,
        "browser_config": {
          "proxy_enabled": true,
          "proxy_country_code": "US"
        }
      },
      "error": null,
      "streaming_url": null,
      "browser_config": {
        "proxy_enabled": true,
        "proxy_country_code": "US"
      }
    }
  ],
  "pagination": {
    "next_cursor": "some_cursor_string",
    "has_more": true
  }
}
```

### Error Handling
- **400 Bad Request**: Invalid request parameters.
- **401 Unauthorized**: Invalid or missing API key.
- **404 Not Found**: The requested resource was not found.
- **500 Internal Server Error**: An unexpected error occurred on the server.
```

--------------------------------

### Submit and Poll TinyFish Runs (Python)

Source: https://docs.tinyfish.ai/examples/bulk-requests-async

Submits multiple web scraping tasks to TinyFish AI asynchronously using Python's aiohttp library. It then polls the status of each run until completion, handling success, failure, or cancellation. Requires the aiohttp library.

```python
import asyncio
import aiohttp

async def submit_tinyfish_run(session, url, goal):
    """Submit a tinyfish run and return the run_id"""
    async with session.post(
        "https://agent.tinyfish.ai/v1/automation/run-async",
        headers={
            "X-API-Key": "YOUR_API_KEY",
            "Content-Type": "application/json",
        },
        json={
            "url": url,
            "goal": goal,
        },
    ) as response:
        result = await response.json()
        return result["run_id"]

async def get_run_status(session, run_id):
    """Get the status of a specific run"""
    async with session.get(
        f"https://agent.tinyfish.ai/v1/runs/{run_id}",
        headers={
            "X-API-Key": "YOUR_API_KEY",
        },
    ) as response:
        return await response.json()

async def wait_for_completion(session, run_id, poll_interval=2):
    """Poll a run until it completes"""
    while True:
        run = await get_run_status(session, run_id)
        status = run.get("status")

        if status in ["COMPLETED", "FAILED", "CANCELLED"]:
            return run

        await asyncio.sleep(poll_interval)

async def main():
    # Define your batch of tasks
    tasks_to_run = [
        {
            "url": "https://scrapeme.live/shop/",
            "goal": "Extract all available products on page two with their name, price, and review rating (if available)"
        },
        {
            "url": "https://books.toscrape.com/",
            "goal": "Extract all available books on page two with their title, price, and review rating (if available)"
        },
    ]

    async with aiohttp.ClientSession() as session:
        # Step 1: Submit all tinyfish runs and collect run_ids
        print("Submitting tinyfish runs...")
        submit_tasks = [
            submit_tinyfish_run(session, task["url"], task["goal"])
            for task in tasks_to_run
        ]
        run_ids = await asyncio.gather(*submit_tasks)
        print(f"Submitted {len(run_ids)} runs: {run_ids}")

        # Step 2: Wait for all runs to complete
        print("Waiting for completion...")
        completion_tasks = [
            wait_for_completion(session, run_id)
            for run_id in run_ids
        ]
        results = await asyncio.gather(*completion_tasks)

        # Step 3: Process results
        for i, run in enumerate(results):
            print(f"Run {i + 1} ({run['run_id']}):")
            print(f"  Status: {run['status']}")
            if run['status'] == 'COMPLETED':
                print(f"  Result: {run.get('result')}")

# Run the async main function
asyncio.run(main())

```

--------------------------------

### Submit Tasks Asynchronously (Python)

Source: https://docs.tinyfish.ai/examples/bulk-requests-async

Submits multiple web scraping tasks asynchronously using aiohttp and asyncio. It collects run IDs for later status checks. This pattern is suitable for large batches of tasks.

```python
async def main():
    tasks_to_run = [
        {"url": "https://example.com/page1", "goal": "Extract product info"},
        {"url": "https://example.com/page2", "goal": "Extract product info"},
        {"url": "https://example.com/page3", "goal": "Extract product info"},
    ]

    async with aiohttp.ClientSession() as session:
        # Submit all tasks
        submit_tasks = [
            submit_tinyfish_run(session, task["url"], task["goal"])
            for task in tasks_to_run
        ]
        run_ids = await asyncio.gather(*submit_tasks)

        print(f"Submitted {len(run_ids)} runs")
        print(f"Run IDs: {run_ids}")
        print("Check status later using GET /v1/runs/:id")

asyncio.run(main())
```

--------------------------------

### Authentication Errors

Source: https://docs.tinyfish.ai/authentication

Details on common authentication errors, including missing API key, invalid API key, and insufficient credits.

```APIDOC
## Authentication Errors

Authentication errors return standard HTTP status codes with a JSON error body. See [Error Codes](/error-codes) for the full reference.

### 401 Unauthorized — Missing API Key

**Description:** The request is missing the `X-API-Key` header.

**Response Body Example:**
```json
{
  "error": {
    "code": "MISSING_API_KEY",
    "message": "X-API-Key header is required"
  }
}
```

**How to fix:**

* Add the `X-API-Key` header to your request
* Check the header name is exactly `X-API-Key` (case-sensitive)

### 401 Unauthorized — Invalid API Key

**Description:** The API key in the request is not valid.

**Response Body Example:**
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid"
  }
}
```

**How to fix:**

* Verify your API key is correct
* Ensure no extra whitespace around the key
* Check if the key has been revoked or regenerated

**Example Request (with debugging):**
```bash
# Debug: Check your key is set
echo $TINYFISH_API_KEY

# Debug: Test authentication
curl -I -X POST https://agent.tinyfish.ai/v1/automation/run \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "goal": "test"}'
```

### 403 Forbidden — Insufficient Credits

**Description:** Authentication succeeded, but you lack credits or an active subscription.

**Response Body Example:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient credits or no active subscription"
  }
}
```

**How to fix:**

* Check your account at [agent.tinyfish.ai/api-keys](https://agent.tinyfish.ai/api-keys)
* Add credits or upgrade your plan
```

--------------------------------

### List Runs

Source: https://docs.tinyfish.ai/api-reference/runs/list-runs

Retrieves a paginated list of automation runs. You can filter runs by their status and control the number of results returned.

```APIDOC
## GET /v1/runs

### Description
Lists automation runs with optional filtering by status. Returns paginated results ordered by creation date (newest first).

### Method
GET

### Endpoint
/v1/runs

### Parameters
#### Query Parameters
- **status** (string) - Optional - Filter by run status. Allowed values: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED. Example: COMPLETED
- **cursor** (string) - Optional - Cursor for pagination (from previous response). Example: eyJpZCI6ImFiYyIsImNyZWF0ZWRBdCI6IjIwMjYtMDEtMDFUMTI6MDA6MDBaIn0=
- **limit** (integer) - Optional - Maximum number of results to return (1-100). Default: 20. Example: 20

### Response
#### Success Response (200)
- **data** (array) - An array of run objects.
  - **run_id** (string) - Unique identifier for the run. Example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
  - **status** (string) - Current status of the run. Enum: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED. Example: COMPLETED
  - **goal** (string) - Natural language goal for this automation run. Example: Find all pricing information
  - **created_at** (string) - ISO 8601 timestamp when run was created. Example: '2026-01-14T10:30:00Z'
  - **started_at** (string) - ISO 8601 timestamp when run started executing. Example: '2026-01-14T10:30:05Z'
  - **finished_at** (string) - ISO 8601 timestamp when run finished. Example: '2026-01-14T10:31:30Z'
  - **result** (object) - Extracted data from the automation run. Nullable.
  - **error** (object) - Error details if the run failed. Nullable.
    - **message** (string) - Error message describing why the run failed. Example: Browser crashed during execution
    - **help_url** (string) - URL to documentation for troubleshooting. Example: https://docs.mino.ai/prompting-guide
    - **help_message** (string) - Human-readable help message with guidance.

#### Response Example
```json
{
  "data": [
    {
      "run_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "status": "COMPLETED",
      "goal": "Find all pricing information",
      "created_at": "2026-01-14T10:30:00Z",
      "started_at": "2026-01-14T10:30:05Z",
      "finished_at": "2026-01-14T10:31:30Z",
      "result": {
        "pricing": "$99/month"
      },
      "error": null
    }
  ],
  "next_cursor": "eyJpZCI6ImFiYyIsImNyZWF0ZWRBdCI6IjIwMjYtMDEtMTRUMDE6MzoxMFoifQ=="
}
```
```

--------------------------------

### Batch Processing with TinyFish Agent (Async)

Source: https://docs.tinyfish.ai/common-patterns

For processing multiple URLs, the asynchronous endpoint allows submitting all tasks at once. This function submits tasks and then polls for their completion, returning an array of results. It's designed to avoid blocking while waiting for individual tasks.

```typescript
async function processBatch(tasks: { url: string; goal: string }[]) {
  // Submit all tasks
  const runIds = await Promise.all(
    tasks.map(async (task) => {
      const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-async", {
        method: "POST",
        headers: {
          "X-API-Key": process.env.TINYFISH_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      const { run_id } = await response.json();
      return run_id;
    })
  );

  // Poll for completion
  const results = await Promise.all(runIds.map((id) => pollUntilComplete(id)));

  return results;
}
```

--------------------------------

### API Authentication

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming

Details the API key authentication method used for accessing the Tinyfish AI API.

```APIDOC
## API Authentication

### Description
Access to the Tinyfish AI API is secured using an API key. This key must be included in the `X-API-Key` header of every request.

### Method
All HTTP Methods (GET, POST, PUT, DELETE, etc.)

### Endpoint
All Endpoints

### Parameters
#### Header Parameters
- **X-API-Key** (string) - Required - Your unique API key for authentication. Get your key from the API Keys page.
```

--------------------------------

### Cancel Run by ID - OpenAPI Specification (YAML)

Source: https://docs.tinyfish.ai/api-reference/runs/cancel-run-by-id

This YAML snippet defines the OpenAPI 3.0 specification for the '/v1/runs/{id}/cancel' endpoint. It details the POST request, parameters, and possible JSON responses, including success (200) with different states and error (401) scenarios. This specification is crucial for understanding and interacting with the API.

```yaml
openapi: 3.0.0
info:
  title: TinyFish Web Agent Automation API
  version: 1.0.0
  description: >-
    REST API for running AI-powered browser automations. Execute tasks on any
    website using natural language instructions.
  contact:
    name: TinyFish Support
    email: support@tinyfish.ai
servers:
  - url: https://tinyfish.ai
    description: Production
security: []
tags:
  - name: Automation
    description: Browser automation endpoints for executing tasks on websites
  - name: Runs
    description: Endpoints for retrieving automation run data
paths:
  /v1/runs/{id}/cancel:
    post:
      tags:
        - Runs
      summary: Cancel run by ID
      description: Cancel a run by ID. Works for async and SSE runs only.
      operationId: cancelRunById
      parameters:
        - schema:
            type: string
            description: Run ID
            example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
          required: true
          description: Run ID
          name: id
          in: path
      responses:
        '200':
          description: >-
            Run cancelled successfully, or already in terminal state
            (idempotent)
          content:
            application/json:
              schema:
                type: object
                properties:
                  run_id:
                    type: string
                    description: The unique identifier of the run
                    example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
                  status:
                    type: string
                    enum:
                      - CANCELLED
                      - COMPLETED
                      - FAILED
                    description: >-
                      The current status of the run. Returns actual status for
                      idempotent responses (e.g., COMPLETED if run already
                      finished)
                    example: CANCELLED
                  cancelled_at:
                    type: string
                    nullable: true
                    description: >-
                      ISO 8601 timestamp when the run was cancelled, or null if
                      not cancelled
                    example: '2026-01-14T10:30:55Z'
                  message:
                    type: string
                    nullable: true
                    description: >-
                      Additional context about the cancellation result (e.g.,
                      "Run already cancelled", "Run already finished")
                    example: Run already cancelled
                required:
                  - run_id
                  - status
                  - cancelled_at
                  - message
                description: Response from cancel run endpoint
              examples:
                cancelled:
                  summary: Run cancelled
                  value:
                    run_id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
                    status: CANCELLED
                    cancelled_at: '2024-01-01T00:00:00Z'
                    message: null
                alreadycancelled:
                  summary: Run already cancelled (idempotent)
                  value:
                    run_id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
                    status: CANCELLED
                    cancelled_at: '2024-01-01T00:00:00Z'
                    message: Run already cancelled
                alreadyCompleted:
                  summary: Run already completed (no-op)
                  value:
                    run_id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
                    status: COMPLETED
                    cancelled_at: null
                    message: Run already finished
        '401':
          description: Unauthorized - Invalid or missing API key
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: object
                    properties:
                      code:
                        type: string
                        enum:
                          - MISSING_API_KEY
                          - INVALID_API_KEY
                          - INVALID_INPUT
                          - RATE_LIMIT_EXCEEDED
                          - INTERNAL_ERROR
                          - UNAUTHORIZED
                          - FORBIDDEN
                          - NOT_FOUND
                        description: Machine-readable error code
                        example: INVALID_INPUT
                      message:
                        type: string
                        description: Human-readable error message
                        example: Field "url" is required and must be a string
                      details:
                        nullable: true

```

--------------------------------

### Use Proxy with Tinyfish AI API

Source: https://docs.tinyfish.ai/examples/scraping

This snippet demonstrates how to route web scraping requests through a specific country's proxy using the Tinyfish AI API. This is useful for accessing geo-restricted content or testing from different locations. It requires an API key, target URL, goal, and proxy configuration.

```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://geo-restricted-site.com",
      goal: "Extract data",
      browser_profile: "stealth",
      proxy_config: {
        enabled: true,
        country_code: "US",
      },
    }),
  });
```

```python
response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run-sse",
    headers={
        "X-API-Key": api_key,
        "Content-Type": "application/json",
    },
    json={
        "url": "https://geo-restricted-site.com",
        "goal": "Extract data",
        "browser_profile": "stealth",
        "proxy_config": {
            "enabled": True,
            "country_code": "US",
        },
    },
    stream=True,
)
```

```bash
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://geo-restricted-site.com",
    "goal": "Extract data",
    "browser_profile": "stealth",
    "proxy_config": {
      "enabled": true,
      "country_code": "US"
    }
  }'
```

--------------------------------

### Embed Live Run Stream (HTML)

Source: https://docs.tinyfish.ai/key-concepts/runs

Embeds a live browser view of a TinyFish Web Agent run into an application using an iframe. The streaming URL is valid for 24 hours after the run completes.

```html
<iframe
  src="https://stream.mino.ai/session/abc123"
  width="800"
  height="600"
/>
```

--------------------------------

### Validating Automation Run Status and Results in TypeScript

Source: https://docs.tinyfish.ai/faq

Demonstrates how to programmatically validate the status and content of an automation run in TypeScript. This code checks for 'COMPLETED' status, analyzes the 'result' field for goal success or failure, and handles 'FAILED' status with error messages.

```typescript
if (run.status === "COMPLETED" && run.result) {
  // Check if result indicates goal failure
  if (run.result.status === "failure" || run.result.error) {
    console.log("Goal not achieved:", run.result.reason || run.result.error);
  } else {
    console.log("Data extracted:", run.result);
  }
} else if (run.status === "FAILED") {
  console.log("Automation failed:", run.error?.message);
}
```

--------------------------------

### get_run

Source: https://docs.tinyfish.ai/mcp-integration

Retrieves details of a specific automation run by its ID. Used to check status and results of async runs.

```APIDOC
## GET /runs/{id}

### Description
Retrieves details of a specific automation run by ID. Use this to check status and get results of async runs.

### Method
GET

### Endpoint
`/runs/{id}`

### Parameters
#### Path Parameters
- **id** (string) - Required - The run ID

### Response
#### Success Response (200)
- **run_id** (string) - The ID of the run.
- **status** (string) - The current status of the run (e.g., PENDING, RUNNING, COMPLETED, FAILED, CANCELLED).
- **goal** (string) - The goal of the automation run.
- **result** (object | null) - The results of the automation if completed, otherwise null.
- **error** (object | null) - An error object if the run failed, otherwise null.

#### Response Example
```json
{
  "run_id": "abc123-...",
  "status": "COMPLETED",
  "goal": "Extract product prices",
  "result": { ... },
  "error": null
}
```
```

--------------------------------

### Error Response Format

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming

Describes the standard error response format returned by the API, including error codes, messages, and optional details.

```APIDOC
## Error Response Format

### Description
This endpoint returns a standard error response format that includes a machine-readable error code, a human-readable error message, and optional additional details.

### Method
All HTTP Methods (GET, POST, PUT, DELETE, etc.)

### Endpoint
All Endpoints

### Parameters
N/A

### Request Body
N/A

### Response
#### Success Response (N/A - This describes error responses)

#### Error Response (Standard)
- **error** (object) - Required - Contains the error details.
  - **code** (string) - Required - Machine-readable error code. Possible values: `MISSING_API_KEY`, `INVALID_API_KEY`, `INVALID_INPUT`, `RATE_LIMIT_EXCEEDED`, `INTERNAL_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`.
  - **message** (string) - Required - Human-readable error message.
  - **details** (object) - Optional - Additional error details, such as validation errors.

#### Response Example
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Field \"url\" is required and must be a string",
    "details": {}
  }
}
```
```

--------------------------------

### Advanced Usage: Rate Limit Handling

Source: https://docs.tinyfish.ai/common-patterns

Provides a robust strategy for handling API rate limits by implementing exponential backoff and retries for requests that fail due to exceeding concurrency limits.

```APIDOC
## Advanced Usage: Rate Limit Handling

### Description
This pattern implements a retry mechanism with exponential backoff to gracefully handle API rate limits (e.g., HTTP 429 errors). It allows a specified number of retries, increasing the delay between attempts to avoid overwhelming the API.

### Method
Any HTTP method (GET, POST, etc.) that might be rate-limited.

### Endpoint
N/A (This is a client-side retry strategy wrapper)

### Parameters
- **fn** (function) - Required - An asynchronous function that performs the API request and returns a Promise.
- **maxRetries** (number) - Optional - The maximum number of times to retry the request. Defaults to 3.

### Request Example (Conceptual)
```typescript
async function withRetry(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      // Check if the error is a rate limit error (e.g., status 429)
      if (e.status === 429 && i < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s, ...
        await sleep(Math.pow(2, i) * 1000);
        continue; // Retry the request
      }
      throw e; // Re-throw other errors or if max retries reached
    }
  }
}

// Usage:
// const data = await withRetry(() => fetch('/api/resource'));
```

### Response
- Returns the result of the successful API call.
- Throws an error if the request fails after all retries or if the error is not a rate limit error.
```

--------------------------------

### REST API Authentication

Source: https://docs.tinyfish.ai/authentication

All REST API requests require an API key passed in the `X-API-Key` header. This section details how to obtain and use your API key.

```APIDOC
## REST API Authentication

All REST API requests require an API key passed in the `X-API-Key` header.

### Getting Your API Key

1. Go to the API Keys page: [agent.tinyfish.ai/api-keys](https://agent.tinyfish.ai/api-keys)
2. Click "Create API Key"
3. Copy and store your key securely. **API keys are shown only once. Store them securely and never commit them to version control.**

### Using Your API Key

Include the `X-API-Key` header in every request.

**Example using cURL:**
```bash
curl -X POST https://agent.tinyfish.ai/v1/automation/run \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "goal": "Extract the page title"}'
```

**Example using TypeScript:**
```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.TINYFISH_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
    goal: "Extract the page title",
  }),
});
```

**Example using Python:**
```python
import os
import requests

response = requests.post(
  "https://agent.tinyfish.ai/v1/automation/run",
  headers={
    "X-API-Key": os.getenv("TINYFISH_API_KEY"),
    "Content-Type": "application/json",
  },
  json={
    "url": "https://example.com",
    "goal": "Extract the page title",
  },
)
```

### Environment Variables

Store your API key in an environment variable:

**Shell profile:**
```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export TINYFISH_API_KEY="your_api_key_here"
```

**Node.js projects (.env file):**
```bash
# .env
TINYFISH_API_KEY=your_api_key_here
```

**Note:** Add `.env` to your `.gitignore` to prevent accidental commits.
```

--------------------------------

### Explicitly Trigger Cross-Step Memory

Source: https://docs.tinyfish.ai/prompting-guide

Instruct the agent to remember specific data points from one step for use in subsequent steps. This is vital for maintaining context and continuity in multi-step operations.

```text
IMPORTANT: On Step 6, a verification code will be displayed.
You MUST remember this code and enter it exactly on Step 7.
```

```text
Other phrases that work:

* "Remember these values—you'll need them for verification"
* "Note the confirmation number displayed"
* "Save this for later"
```

--------------------------------

### Submit and Poll TinyFish Runs (TypeScript)

Source: https://docs.tinyfish.ai/examples/bulk-requests-async

Submits multiple web scraping tasks to TinyFish AI asynchronously using TypeScript's fetch API. It then polls the status of each run until completion, handling success, failure, or cancellation. This function relies on standard browser/Node.js fetch capabilities.

```typescript
async function submitTinyFishRun(url: string, goal: string): Promise<string> {
  const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-async", {
    method: "POST",
    headers: {
      "X-API-Key": "YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, goal }),
  });

  const result = await response.json();
  return result.run_id;
}

async function getRunStatus(runId: string) {
  const response = await fetch(`https://agent.tinyfish.ai/v1/runs/${runId}`, {
    headers: {
      "X-API-Key": "YOUR_API_KEY",
    },
  });

  return await response.json();
}

async function waitForCompletion(runId: string, pollInterval = 2000) {
  while (true) {
    const run = await getRunStatus(runId);
    const status = run.status;

    if (["COMPLETED", "FAILED", "CANCELLED"].includes(status)) {
      return run;
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }
}

async function main() {
  // Define your batch of tasks
  const tasksToRun = [
    {
      url: "https://scrapeme.live/shop/",
      goal: "Extract all available products with their name, price, and review rating",
    },
    {
      url: "https://books.toscrape.com/",
      goal: "Extract all available books with their title, price, and review rating",
    },
  ];

  // Step 1: Submit all tinyfish runs and collect run_ids
  console.log("Submitting tinyfish runs...");
  const runIds = await Promise.all(tasksToRun.map((task) => submitTinyFishRun(task.url, task.goal)));
  console.log(`Submitted ${runIds.length} runs:`, runIds);

  // Step 2: Wait for all runs to complete
  console.log("Waiting for completion...");
  const results = await Promise.all(runIds.map((runId) => waitForCompletion(runId)));

  // Step 3: Process results
  results.forEach((run, i) => {
    console.log(`Run ${i + 1} (${run.run_id}):`);
    console.log(`  Status: ${run.status}`);
    if (run.status === "COMPLETED") {

```

--------------------------------

### Synchronous Data Extraction with TinyFish Agent

Source: https://docs.tinyfish.ai/common-patterns

Use the synchronous endpoint for quick, one-off extractions where immediate results are needed. This function takes a URL and a description of the data to extract, returning the data as JSON or null if extraction fails.

```typescript
async function extractData(url: string, dataDescription: string) {
  const response = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      goal: `Extract ${dataDescription}. Return as JSON.`,
    }),
  });

  const run = await response.json();
  return run.status === "COMPLETED" ? run.result : null;
}

// Usage
const products = await extractData(
  "https://example.com/products",
  "all product names and prices"
);
```

--------------------------------

### Configure Stealth Browser Profile for Protected Websites

Source: https://docs.tinyfish.ai/key-concepts/browser-profiles

The 'stealth' browser profile is designed for websites with bot protection like Cloudflare or DataDome. It employs anti-detection techniques to bypass these systems. This configuration includes the URL, goal, and explicitly sets the browser profile to 'stealth'.

```typescript
{
  url: "https://protected-site.com",
  goal: "Extract product data",
  browser_profile: "stealth"
}
```

--------------------------------

### Process Completed Run Status (Python)

Source: https://docs.tinyfish.ai/examples/bulk-requests-async

Handles the status of a completed Tinyfish AI run, returning the result for 'COMPLETED' runs and printing error messages for 'FAILED' or 'CANCELLED' runs. This function is crucial for robust error handling.

```python
async def process_completed_run(run):
    if run["status"] == "COMPLETED":
        return run.get("result")
    elif run["status"] == "FAILED":
        error = run.get("error", {}).get("message", "Unknown error")
        print(f"Run {run['run_id']} failed: {error}")
        return None
    elif run["status"] == "CANCELLED":
        print(f"Run {run['run_id']} was cancelled")
        return None
```

--------------------------------

### Web Scraping: Extract Product Data (TypeScript, Python, cURL)

Source: https://docs.tinyfish.ai/examples/scraping

Extracts specific product details like name, price, and stock status from a given URL. This function uses the Tinyfish AI API and requires an API key. It streams the response and parses JSON events to retrieve the final result.

```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://scrapeme.live/shop/Bulbasaur/",
      goal: "Extract the product name, price, and stock status",
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const event = JSON.parse(line.slice(6));

        if (event.type === "COMPLETE" && event.status === "COMPLETED") {
          console.log("Result:", event.resultJson);
        }
      }
    }
  }
```

```python
import requests
import json

response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run-sse",
    headers={
        "X-API-Key": api_key,
        "Content-Type": "application/json",
    },
    json={
        "url": "https://scrapeme.live/shop/Bulbasaur/",
        "goal": "Extract the product name, price, and stock status",
    },
    stream=True,
)

for line in response.iter_lines():
    if line:
        line_str = line.decode("utf-8")
        if line_str.startswith("data: "):
            event = json.loads(line_str[6:])

            if event.get("type") == "COMPLETE" and event.get("status") == "COMPLETED":
                print("Result:", event["resultJson"])
```

```curl
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://scrapeme.live/shop/Bulbasaur/",
    "goal": "Extract the product name, price, and stock status"
  }'
```

--------------------------------

### Submit Tasks Asynchronously (TypeScript)

Source: https://docs.tinyfish.ai/examples/bulk-requests-async

Submits multiple web scraping tasks asynchronously using Promises. It collects run IDs for later status checks. This pattern is suitable for large batches of tasks.

```typescript
async function main() {
  const tasksToRun = [
    { url: "https://example.com/page1", goal: "Extract product info" },
    { url: "https://example.com/page2", goal: "Extract product info" },
    { url: "https://example.com/page3", goal: "Extract product info" },
  ];

  // Submit all tasks
  const runIds = await Promise.all(tasksToRun.map((task) => submitTinyFishRun(task.url, task.goal)));

  console.log(`Submitted ${runIds.length} runs`);
  console.log("Run IDs:", runIds);
  console.log("Check status later using GET /v1/runs/:id");
}

main();
```

--------------------------------

### Cancel a Run (TypeScript)

Source: https://docs.tinyfish.ai/key-concepts/runs

Demonstrates how to cancel a pending or running TinyFish Web Agent run using a POST request to the /v1/runs/{id}/cancel endpoint. Requires the TINYFISH_API_KEY environment variable.

```typescript
const response = await fetch(`https://agent.tinyfish.ai/v1/runs/${runId}/cancel`, {
  method: "POST",
  headers: {
    "X-API-Key": process.env.TINYFISH_API_KEY,
  },
});

const result = await response.json();
// result.status: CANCELLED, COMPLETED, or FAILED
// result.cancelled_at: timestamp if cancelled
// result.message: additional context (e.g. "Run already cancelled")
```

--------------------------------

### Handle Run Results (TypeScript)

Source: https://docs.tinyfish.ai/key-concepts/runs

A TypeScript function to handle the different statuses and results of a TinyFish Web Agent run. It differentiates between infrastructure failures and goal failures within the result object.

```typescript
async function handleTinyFishResponse(run: TinyFishRun) {
  switch (run.status) {
    case "COMPLETED":
      if (!run.result) {
        return { success: false, error: "No result returned" };
      }

      // Check for goal-level failure in result
      if (run.result.status === "failure" || run.result.error) {
        return {
          success: false,
          error: run.result.reason || run.result.error || "Goal not achieved",
        };
      }

      return { success: true, data: run.result };

    case "FAILED":
      return {
        success: false,
        error: run.error?.message || "Automation failed",
        retryable: true,
      };

    case "CANCELLED":
      return { success: false, error: "Run was cancelled" };

    default:
      return { success: false, error: `Unexpected status: ${run.status}` };
  }
}
```

--------------------------------

### Automation Run Response

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-synchronously

Details about the response of an automation run, indicating success or failure.

```APIDOC
## GET /websites/tinyfish_ai/runs/{run_id}

### Description
Retrieves the details of a specific automation run.

### Method
GET

### Endpoint
/websites/tinyfish_ai/runs/{run_id}

### Parameters
#### Path Parameters
- **run_id** (string) - Required - The unique identifier for the automation run.

### Response
#### Success Response (200)
- **run_id** (string) - The unique identifier for the automation run.
- **status** (string) - The status of the run (e.g., COMPLETED, FAILED).
- **started_at** (string) - The timestamp when the run started.
- **finished_at** (string) - The timestamp when the run finished.
- **num_of_steps** (integer) - The total number of steps in the automation.
- **result** (object) - The result of the run if successful. Contains details like product and price.
- **error** (object) - Error details if the run failed. Contains 'code', 'message', and optional 'details'.

#### Response Example (Success)
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "COMPLETED",
  "started_at": "2024-01-01T00:00:00Z",
  "finished_at": "2024-01-01T00:00:30Z",
  "num_of_steps": 5,
  "result": {
    "product": "iPhone 15",
    "price": "$799"
  },
  "error": null
}
```

#### Response Example (Failure)
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "FAILED",
  "started_at": "2024-01-01T00:00:00Z",
  "finished_at": "2024-01-01T00:00:30Z",
  "num_of_steps": 5,
  "result": null,
  "error": {
    "code": "BROWSER_CRASHED",
    "message": "Browser crashed during execution",
    "help_url": "https://docs.mino.ai/prompting-guide",
    "help_message": "Need help? Check out our goal prompting guide for tips and examples."
  }
}
```
```

--------------------------------

### 403 Forbidden - Insufficient Credits Response (JSON)

Source: https://docs.tinyfish.ai/authentication

This JSON response indicates that while authentication was successful, the account lacks sufficient credits or an active subscription to perform the requested action. To resolve this, check your account status and billing information on the Tinyfish AI dashboard.

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient credits or no active subscription"
  }
}
```

--------------------------------

### NOT_FOUND

Source: https://docs.tinyfish.ai/error-codes

This error is returned when the requested resource, such as a specific run, does not exist on the server.

```APIDOC
## NOT_FOUND

**HTTP Status:** 404

The requested resource does not exist.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Run not found"
  }
}
```

**Common Causes:**

* Invalid `run_id` in `GET /v1/runs/:id`
* Run was deleted or never existed
* Typo in the run ID

**Solution:** Verify the run ID is correct. Run IDs are returned from `/v1/automation/run-async` or can be listed via `GET /v1/runs`.
```

--------------------------------

### 401 Unauthorized - Invalid API Key Debugging (Bash)

Source: https://docs.tinyfish.ai/authentication

This bash script snippet provides commands to debug invalid API key errors. It includes checking if the TINYFISH_API_KEY environment variable is set and a curl command to test authentication by sending a POST request with the API key.

```bash
# Debug: Check your key is set
 echo $TINYFISH_API_KEY

# Debug: Test authentication
 curl -I -X POST https://agent.tinyfish.ai/v1/automation/run \
   -H "X-API-Key: $TINYFISH_API_KEY" \
   -H "Content-Type: application/json" \
   -d '{"url": "https://example.com", "goal": "test"}'
```

--------------------------------

### Error Response Format

Source: https://docs.tinyfish.ai/api-reference/automation/start-automation-asynchronously

This section describes the standard error response format used across the Tinyfish AI API. It includes a machine-readable error code, a human-readable message, and optional additional details.

```APIDOC
## Error Response Format

### Description
Standard error response format used across the API.

### Method
N/A (Applies to all methods)

### Endpoint
N/A

### Parameters
None

### Request Example
None

### Response
#### Error Response
- **error** (object) - Required - Contains error details.
  - **code** (string) - Required - Machine-readable error code. Enum: MISSING_API_KEY, INVALID_API_KEY, INVALID_INPUT, RATE_LIMIT_EXCEEDED, INTERNAL_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND.
  - **message** (string) - Required - Human-readable error message.
  - **details** (object) - Optional - Additional error details.

#### Response Example
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Field \"url\" is required and must be a string",
    "details": {}
  }
}
```
```

--------------------------------

### MISSING_API_KEY

Source: https://docs.tinyfish.ai/error-codes

This error occurs when the `X-API-Key` header is not included in the request, indicating an authentication issue.

```APIDOC
## MISSING_API_KEY

**HTTP Status:** 401

The `X-API-Key` header was not included in the request.

```json
{
  "error": {
    "code": "MISSING_API_KEY",
    "message": "X-API-Key header is required"
  }
}
```

**Solution:** Add the `X-API-Key` header to your request:

```bash
curl -H "X-API-Key: $TINYFISH_API_KEY" ...
```
```

--------------------------------

### MCP Authentication

Source: https://docs.tinyfish.ai/authentication

The MCP endpoint uses OAuth 2.1 for secure authentication with AI assistants like Claude and Cursor.

```APIDOC
## MCP Authentication

The MCP endpoint uses OAuth 2.1 for secure authentication with AI assistants.

### How It Works

1. Add the TinyFish MCP server to your AI client configuration. See the [MCP Integration guide](/mcp-integration) for setup instructions.
2. When you first use the tool, a browser window opens for authentication.
3. Log in with your TinyFish account.
4. Authorization is cached for future sessions.

**Note:** You need a TinyFish account with an active subscription or credits. [Sign up here](https://agent.tinyfish.ai/api-keys).
```

--------------------------------

### POST /v1/runs/{id}/cancel

Source: https://docs.tinyfish.ai/api-reference/runs/cancel-run-by-id

Cancel a specific automation run by its unique identifier. This endpoint is idempotent and works for both asynchronous and Server-Sent Events (SSE) runs.

```APIDOC
## POST /v1/runs/{id}/cancel

### Description
Cancel a run by ID. Works for async and SSE runs only.

### Method
POST

### Endpoint
/v1/runs/{id}/cancel

### Parameters
#### Path Parameters
- **id** (string) - Required - Run ID

### Request Example
```json
{
  "example": "No request body needed for this endpoint."
}
```

### Response
#### Success Response (200)
- **run_id** (string) - The unique identifier of the run.
- **status** (string) - The current status of the run. Enum: CANCELLED, COMPLETED, FAILED.
- **cancelled_at** (string) - ISO 8601 timestamp when the run was cancelled, or null if not cancelled.
- **message** (string) - Additional context about the cancellation result.

#### Response Example
```json
{
  "run_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "CANCELLED",
  "cancelled_at": "2024-01-01T00:00:00Z",
  "message": null
}
```

#### Error Response (401)
- **error.code** (string) - Machine-readable error code. Enum: MISSING_API_KEY, INVALID_API_KEY, INVALID_INPUT, RATE_LIMIT_EXCEEDED, INTERNAL_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND.
- **error.message** (string) - Human-readable error message.
- **error.details** (object) - Optional details about the error.
```

--------------------------------

### Run Multiple TinyFish Agents Concurrently (TypeScript)

Source: https://docs.tinyfish.ai/examples/bulk-requests-sync

Executes multiple TinyFish Web Agent runs in parallel using TypeScript's async/await and Promise.all. This function takes a list of tasks, each with a URL and a goal, and processes them concurrently. It utilizes the Fetch API for making HTTP requests.

```typescript
async function runTinyFish(url: string, goal: string) {
  const response = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
    method: "POST",
    headers: {
      "X-API-Key": "YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, goal }),
  });

  const result = await response.json();
  return result.result;
}

async function main() {
  // Define your batch of tasks - scraping multiple sites
  const tasksToRun = [
    {
      url: "https://scrapeme.live/shop/",
      goal: "Extract all available products with their name, price, and review rating",
    },
    {
      url: "https://books.toscrape.com/",
      goal: "Extract all available books with their title, price, and review rating",
    },
  ];

  // Fire all requests concurrently
  const promises = tasksToRun.map((task) => runTinyFish(task.url, task.goal));

  // Wait for all to complete
  const results = await Promise.all(promises);

  // Process results
  results.forEach((result, i) => {
    console.log(`Task ${i + 1} result:`, result);
  });
}

main();
```

--------------------------------

### HTTP Status Codes

Source: https://docs.tinyfish.ai/api-reference/automation/start-automation-asynchronously

Details common HTTP status codes and their meanings in the context of the Tinyfish AI API, including specific error codes and messages.

```APIDOC
## HTTP Status Codes

### Description
This section details the common HTTP status codes and their associated error responses for the Tinyfish AI API.

### Method
N/A (Applies to all methods)

### Endpoint
N/A

### Parameters
None

### Request Example
None

### Response
#### Common Error Responses
- **401 Unauthorized**: Invalid or missing API key.
- **403 Forbidden**: Insufficient credits or no active subscription.
- **500 Internal Server Error**: Failed to create or enqueue the automation run.

#### Response Example (401 Unauthorized)
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid."
  }
}
```

#### Response Example (403 Forbidden)
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have sufficient credits to perform this action."
  }
}
```

#### Response Example (500 Internal Server Error)
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An internal server error occurred."
  }
}
```
```

--------------------------------

### Use Stealth Mode with Tinyfish AI API

Source: https://docs.tinyfish.ai/examples/scraping

This snippet shows how to enable stealth mode when making requests to the Tinyfish AI API. Stealth mode is designed to bypass bot protection on websites. It requires an API key and specifies the target URL and the desired goal.

```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.TINYFISH_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://protected-site.com",
      goal: "Extract product data",
      browser_profile: "stealth",
    }),
  });
```

```python
response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run-sse",
    headers={
        "X-API-Key": api_key,
        "Content-Type": "application/json",
    },
    json={
        "url": "https://protected-site.com",
        "goal": "Extract product data",
        "browser_profile": "stealth",
    },
    stream=True,
)
```

```bash
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://protected-site.com",
    "goal": "Extract product data",
    "browser_profile": "stealth"
  }'
```

--------------------------------

### Retry Extraction with Stealth Mode Fallback

Source: https://docs.tinyfish.ai/common-patterns

Handles websites that may block automated requests. This function first attempts extraction using a standard 'lite' browser profile. If blocked, it automatically retries with a 'stealth' profile and a US proxy.

```typescript
async function extractWithFallback(url: string, goal: string) {
  // Try standard mode first
  let result = await runAutomation(url, goal, { browser_profile: "lite" });

  if (result.status === "FAILED" && result.error?.message.includes("blocked")) {
    // Retry with stealth mode
    result = await runAutomation(url, goal, {
      browser_profile: "stealth",
      proxy_config: { enabled: true, country_code: "US" },
    });
  }

  return result;
}
```

--------------------------------

### Set Explicit Boundaries for Scope Limitation

Source: https://docs.tinyfish.ai/prompting-guide

Define clear limits on the scope of an agent's actions to prevent over-extraction or unintended navigation. This includes specifying the number of items to extract or prohibiting pagination.

```text
Extract the FIRST 10 products only from the current page.
Do not click pagination or load more items.
```

--------------------------------

### Cancel Run by ID

Source: https://docs.tinyfish.ai/api-reference/runs/cancel-run-by-id

Allows cancellation of asynchronous and Server-Sent Events (SSE) runs by their unique identifier.

```APIDOC
## DELETE /runs/{run_id}

### Description
Cancel a run by ID. Works for async and SSE runs only.

### Method
DELETE

### Endpoint
/runs/{run_id}

### Parameters
#### Path Parameters
- **run_id** (string) - Required - The unique identifier of the run to cancel.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message indicating the run has been canceled.

#### Response Example
```json
{
  "message": "Run with ID 'run_123' has been canceled successfully."
}
```
```

--------------------------------

### Standard Error Response Format

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming

Defines the standard JSON structure for error responses from the Tinyfish AI API. It includes a machine-readable error code, a human-readable message, and optional details.

```json
{
  "error": {
    "code": "MACHINE_READABLE_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

--------------------------------

### 401 Unauthorized - Missing API Key Response (JSON)

Source: https://docs.tinyfish.ai/authentication

This JSON response indicates that the request is missing the required 'X-API-Key' header. To resolve this, ensure the 'X-API-Key' header is included in your request and that its name is spelled correctly (case-sensitive).

```json
{
  "error": {
    "code": "MISSING_API_KEY",
    "message": "X-API-Key header is required"
  }
}
```

--------------------------------

### Exponential Backoff for Rate Limit Handling

Source: https://docs.tinyfish.ai/common-patterns

Implements exponential backoff to handle rate limiting (HTTP 429 errors) when interacting with the TinyFish API. This function retries a given asynchronous operation up to a specified number of times, increasing the delay between retries.

```typescript
async function withRetry(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e.status === 429 && i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }
      throw e;
    }
  }
}
```

--------------------------------

### Error Responses

Source: https://docs.tinyfish.ai/api-reference/runs/cancel-run-by-id

Details on standard error response formats for various HTTP status codes, including 404 and 500.

```APIDOC
## Error Responses

### Description
This section details the standard error response format used across the API for various error conditions, including resource not found and internal server errors.

### Method
N/A (Applies to all methods)

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Standard Error Response Format
- **error** (object) - Required - Contains detailed error information.
  - **code** (string) - Required - Machine-readable error code. Possible values: `MISSING_API_KEY`, `INVALID_API_KEY`, `INVALID_INPUT`, `RATE_LIMIT_EXCEEDED`, `INTERNAL_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`.
  - **message** (string) - Required - Human-readable error message.
  - **details** (object) - Optional - Additional error details, such as validation errors.

#### 404 Not Found Response Example
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Run not found or not owned by this API key",
    "details": null
  }
}
```

#### 500 Internal Server Error Response Example
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred on the server.",
    "details": {
      "error_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
    }
  }
}
```
```

--------------------------------

### Error Response

Source: https://docs.tinyfish.ai/api-reference/automation/start-automation-asynchronously

Standard error response format for API requests.

```APIDOC
## Error Response

### Description
Standard error response format.

### Response
#### Error Response (e.g., 400, 401, 404, 500)
- **code** (integer) - The error code.
- **message** (string) - A human-readable error message.

#### Response Example
```json
{
  "code": 404,
  "message": "Resource not found"
}
```
```

--------------------------------

### Error Responses

Source: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-synchronously

Standard error formats for various HTTP status codes.

```APIDOC
## Error Handling

### Error Response Format
All error responses follow a standard structure:

```json
{
  "error": {
    "code": "MACHINE_READABLE_CODE",
    "message": "Human-readable error message",
    "details": "Optional additional details"
  }
}
```

### Common Error Codes
- **MISSING_API_KEY**: API key is missing in the request.
- **INVALID_API_KEY**: The provided API key is invalid.
- **INVALID_INPUT**: The request payload contains invalid data or format.
- **RATE_LIMIT_EXCEEDED**: The number of requests exceeds the allowed rate limit.
- **INTERNAL_ERROR**: An unexpected error occurred on the server.
- **UNAUTHORIZED**: Authentication failed, likely due to an invalid API key.
- **FORBIDDEN**: The authenticated user does not have permission to perform the action.
- **NOT_FOUND**: The requested resource could not be found.

### Specific Error Responses

#### 400 Bad Request
Returned when the request is invalid, such as missing required fields or incorrect data format.

**Response Example:**
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Field \"url\" is required and must be a string",
    "details": null
  }
}
```

#### 401 Unauthorized
Returned when the API key is missing or invalid.

**Response Example:**
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid API Key provided.",
    "details": null
  }
}
```

#### 403 Forbidden
Returned when the user lacks the necessary permissions, such as insufficient credits or no active subscription.

**Response Example:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient credits. Please check your subscription.",
    "details": null
  }
}
```
```

--------------------------------

### INVALID_API_KEY

Source: https://docs.tinyfish.ai/error-codes

This error indicates that the provided API key is invalid, either non-existent or revoked.

```APIDOC
## INVALID_API_KEY

**HTTP Status:** 401

The provided API key does not exist or has been revoked.

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid"
  }
}
```

**Solutions:**

1. Verify your API key is correct (no extra whitespace)
2. Check if the key was deleted in the [API Keys dashboard](https://agent.tinyfish.ai/api-keys)
3. Generate a new key if needed
```

--------------------------------

### UNAUTHORIZED

Source: https://docs.tinyfish.ai/error-codes

This error signifies authentication failure for reasons other than a missing or invalid API key, possibly related to account status or key expiration.

```APIDOC
## UNAUTHORIZED

**HTTP Status:** 401

Authentication failed for a reason other than missing/invalid key.

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication failed"
  }
}
```

**Solutions:**

1. Check your account status at [agent.tinyfish.ai/api-keys](https://agent.tinyfish.ai/api-keys)
2. Verify your API key hasn't expired
3. Try generating a new API key
```

--------------------------------

### API Error Response Format (JSON)

Source: https://docs.tinyfish.ai/error-codes

Illustrates the standard JSON structure for all API error responses. It includes a top-level 'error' object containing a 'code', a human-readable 'message', and an optional 'details' object for more specific context.

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {}
  }
}
```

--------------------------------

### Check Individual Run Status

Source: https://docs.tinyfish.ai/examples/bulk-requests-async

Retrieve the status and results of a specific asynchronous run using its run ID.

```APIDOC
## GET /v1/runs/:id

### Description
Fetch the status and results for a specific asynchronous run using its unique `run_id`. This endpoint allows you to monitor the progress of individual tasks submitted via the `/v1/automation/run-async` endpoint.

### Method
GET

### Endpoint
/v1/runs/:id

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the run to retrieve.

### Response
#### Success Response (200)
- **run_id** (string) - Description: The unique identifier of the run.
- **status** (string) - Description: The current status of the run (e.g., 'pending', 'processing', 'completed', 'failed').
- **result** (object) - Description: The result of the run if completed. Structure may vary based on the task.
- **error** (string) - Description: An error message if the run failed.

#### Response Example
```json
{
  "run_id": "run_abc123",
  "status": "completed",
  "result": {
    "translation": "bonjour le monde"
  }
}
```
```

--------------------------------

### 401 Unauthorized - Invalid API Key Response (JSON)

Source: https://docs.tinyfish.ai/authentication

This JSON response signifies that the API key provided in the request is invalid. To fix this, verify that your API key is correct, free of extra whitespace, and has not been revoked or regenerated.

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid"
  }
}
```

--------------------------------

### FORBIDDEN

Source: https://docs.tinyfish.ai/error-codes

This error indicates that authentication was successful, but the user lacks the necessary permissions or resources (like credits) to perform the requested action.

```APIDOC
## FORBIDDEN

**HTTP Status:** 403

Authentication succeeded, but you lack permission for this action.

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient credits or no active subscription"
  }
}
```

**Common Causes:**

* No remaining credits
* Subscription has expired
* Attempting to access a resource you don't own

**Solution:** Check your account balance and subscription status at [agent.tinyfish.ai/api-keys](https://agent.tinyfish.ai/api-keys).
```

--------------------------------

### RATE_LIMIT_EXCEEDED

Source: https://docs.tinyfish.ai/error-codes

This error occurs when the number of requests exceeds the allowed limit within a given time frame. It suggests implementing backoff strategies.

```APIDOC
## RATE_LIMIT_EXCEEDED

**HTTP Status:** 429

Too many requests in a short period.

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds."
  }
}
```

**Solutions:**

1. Implement exponential backoff in your code
2. Space out requests (recommended: 1-2 seconds between calls)
3. Use batch endpoints for high-volume workloads
4. Contact support for higher rate limits

**Example: Exponential Backoff**

```python
import time
import random

def call_with_backoff(fn, max_retries=5):
    for attempt in range(max_retries):
        try:
            return fn()
        except RateLimitError:
            if attempt == max_retries - 1:
                raise
            wait = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait)
```
```

--------------------------------

### INVALID_INPUT

Source: https://docs.tinyfish.ai/error-codes

This error is returned when the request body fails validation, with details specifying the fields that caused the failure.

```APIDOC
## INVALID_INPUT

**HTTP Status:** 400

The request body failed validation.

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Validation failed",
    "details": {
      "url": "Invalid URL format",
      "goal": "Required field missing"
    }
  }
}
```

**Common Causes:**

* `url` is missing or not a valid URL (must include `https://`)
* `goal` is empty or missing
* `browser_profile` is not "lite" or "stealth"
* `proxy_config.country_code` is not a supported 2-letter code

**Solution:** Check the `details` field for specific validation errors.
```

--------------------------------

### INTERNAL_ERROR

Source: https://docs.tinyfish.ai/error-codes

This error signifies an unexpected issue on the server side, requiring a retry or further investigation.

```APIDOC
## INTERNAL_ERROR

**HTTP Status:** 500

An unexpected error occurred on the server.

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

**Solutions:**

1. Retry the request after a brief delay
2. If the error persists, check [status.agent.tinyfish.ai](https://status.agent.tinyfish.ai) for outages
3. Contact support with your request details and timestamp
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.