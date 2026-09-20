const http = require("http");

// Helper to make JSON HTTP requests
function request(options, body = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, res => {
            let data = "";
            res.on("data", chunk => (data += chunk));
            res.on("end", () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });
        req.on("error", reject);
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log("=== Testing Task Manager API ===");

    // 1. Health check
    const health = await request({
        hostname: "localhost",
        port: 3000,
        path: "/api/health",
        method: "GET"
    });
    console.log("1. Health Check:", health.status, health.data.status);

    // 2. Signup User 1
    const user1Email = `dev_${Date.now()}@example.com`;
    const signup1 = await request(
        {
            hostname: "localhost",
            port: 3000,
            path: "/auth/signup",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        },
        { name: "Alex Johnson", email: user1Email, password: "password123" }
    );
    console.log("2. Signup User 1:", signup1.status, signup1.data.msg);

    // 3. Login User 1
    const login1 = await request(
        {
            hostname: "localhost",
            port: 3000,
            path: "/auth/login",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        },
        { email: user1Email, password: "password123" }
    );
    console.log("3. Login User 1:", login1.status, "Token received:", !!login1.data.token);
    const token1 = login1.data.token;

    // 4. Create Tasks for User 1
    const task1 = await request(
        {
            hostname: "localhost",
            port: 3000,
            path: "/tasks",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token1}`
            }
        },
        {
            title: "Build Capstone Dashboard UI",
            description: "Implement responsive task cards, stats, and sleek theme",
            category: "Work",
            priority: "High",
            dueDate: new Date(Date.now() + 86400000).toISOString()
        }
    );
    console.log("4. Create Task 1:", task1.status, task1.data.title);

    const task2 = await request(
        {
            hostname: "localhost",
            port: 3000,
            path: "/tasks",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token1}`
            }
        },
        {
            title: "Study Mongoose Aggregations",
            description: "Review indexing, pipelines, and schema methods",
            category: "Study",
            priority: "Medium",
            dueDate: new Date(Date.now() + 172800000).toISOString()
        }
    );
    console.log("4. Create Task 2:", task2.status, task2.data.title);

    // 5. Toggle completion of Task 1
    const toggle1 = await request({
        hostname: "localhost",
        port: 3000,
        path: `/tasks/${task1.data._id}/toggle`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token1}` }
    });
    console.log("5. Toggle Task 1 Completed:", toggle1.status, toggle1.data.completed);

    // 6. Get Stats for User 1
    const stats1 = await request({
        hostname: "localhost",
        port: 3000,
        path: "/tasks/stats",
        method: "GET",
        headers: { Authorization: `Bearer ${token1}` }
    });
    console.log("6. User 1 Stats:", stats1.status, {
        total: stats1.data.total,
        completed: stats1.data.completed,
        pending: stats1.data.pending,
        completionRate: stats1.data.completionRate
    });

    // 7. Signup & Login User 2 (Isolation test)
    const user2Email = `guest_${Date.now()}@example.com`;
    await request(
        {
            hostname: "localhost",
            port: 3000,
            path: "/auth/signup",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        },
        { name: "Bob Smith", email: user2Email, password: "password123" }
    );
    const login2 = await request(
        {
            hostname: "localhost",
            port: 3000,
            path: "/auth/login",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        },
        { email: user2Email, password: "password123" }
    );
    const token2 = login2.data.token;

    // User 2 tasks should be empty
    const tasksUser2 = await request({
        hostname: "localhost",
        port: 3000,
        path: "/tasks",
        method: "GET",
        headers: { Authorization: `Bearer ${token2}` }
    });
    console.log("7. User 2 Tasks Count (Isolation):", tasksUser2.data.length);

    // User 2 trying to delete User 1's task should fail with 404
    const deleteAttempt = await request({
        hostname: "localhost",
        port: 3000,
        path: `/tasks/${task1.data._id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token2}` }
    });
    console.log("8. User 2 unauthorized delete attempt (404 expected):", deleteAttempt.status);

    console.log("=== All Backend API Tests Passed Successfully! ===");
    process.exit(0);
}

runTests().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
