local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

local DASHBOARD_URL = "https://thairp-backend.onrender.com"

local suspiciousKeywords = {
    "hack", "fly", "speed", "noclip", "exploit", "cheat", "bot", "inject"
}

local function isSuspicious(name)
    local lower = name:lower()
    for _, word in ipairs(suspiciousKeywords) do
        if lower:find(word) then return true end
    end
    return false
end

-- ส่งรายชื่อผู้เล่นทุก 5 วินาที
task.spawn(function()
    while true do
        local players = {}
        for _, p in ipairs(Players:GetPlayers()) do
            table.insert(players, {
                name = p.Name,
                userId = p.UserId,
                ping = math.floor(p:GetNetworkPing() * 1000),
                suspicious = isSuspicious(p.Name)
            })
        end
        pcall(function()
            HttpService:PostAsync(
                DASHBOARD_URL .. "/players/update",
                HttpService:JSONEncode({ players = players }),
                Enum.HttpContentType.ApplicationJson
            )
        end)
        task.wait(5)
    end
end)

-- ดึงคำสั่งจากเว็บทุก 3 วินาที
task.spawn(function()
    while true do
        pcall(function()
            local res = HttpService:GetAsync(DASHBOARD_URL .. "/commands")
            local data = HttpService:JSONDecode(res)
            for _, cmd in ipairs(data.commands or {}) do
                if cmd.action == "kick" then
                    local target = Players:FindFirstChild(cmd.player)
                    if target then
                        target:Kick(cmd.reason or "ถูก kick โดย admin")
                    end
                elseif cmd.action == "announce" then
                    -- ส่งประกาศผ่าน AdminAnnounce
                    local rs = game:GetService("ReplicatedStorage")
                    local event = rs:FindFirstChild("AdminAnnounce")
                    if event then
                        for _, p in ipairs(Players:GetPlayers()) do
                            event:FireClient(p, cmd.message, cmd.msgType or "info")
                        end
                    end
                end
            end
        end)
        task.wait(3)
    end
end)

print("[ServerMonitor] เริ่มทำงานแล้ว")s
