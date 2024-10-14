
---

# Progressbar Integration for QBCore

This guide will help you integrate QBCore's progressbar into `ox_lib`.

### Step-by-Step Instructions

1. Go to `ox_lib/resource/interface/client/progress.lua`.
2. Find the function `lib.progressBar(data)`.
3. Replace the entire function code with the one below:

```lua
function lib.progressBar(data)
    while progress ~= nil do Wait(0) end

    if not interruptProgress(data) then
        playerState.invBusy = true
        exports['progressbar']:Progress({
            name = "random_task",
            duration = data.duration,
            label = data.label,
            useWhileDead = false,
            canCancel = true,
            controlDisables = {
                disableMovement = false,
                disableCarMovement = false,
                disableMouse = false,
                disableCombat = false,
            },
        }, function(cancelled)
            if not cancelled then
                -- finished
                progress = nil
                playerState.invBusy = false
            else
                -- cancelled
                print("Progress cancelled")
                progress = false
                Citizen.Wait(1000)
                progress = nil
                playerState.invBusy = false
            end
        end)

        return startProgress(data)
    end
end
```

---

# QBCore Progressbar Usage

This progressbar dependency is used for creating and managing progress bars in a QBCore framework.

### Client Function: `QBCore.Functions.Progressbar`

```lua
QBCore.Functions.Progressbar(
  name: string, 
  label: string, 
  duration: number, 
  useWhileDead: boolean, 
  canCancel: boolean, 
  disableControls: table, 
  animation: table, 
  prop: table, 
  propTwo: table, 
  onFinish: function, 
  onCancel: function
)
```

#### Example

```lua
QBCore.Functions.Progressbar("random_task", "Doing something", 5000, false, true, {
    disableMovement = false,
    disableCarMovement = false,
    disableMouse = false,
    disableCombat = true,
}, {
    animDict = "mp_suicide",
    anim = "pill",
    flags = 49,
}, {}, {}, function()
    -- Task complete
end, function()
    -- Task cancelled
end)
```

---

# Exports

### `exports['progressbar']:Progress(data, handler)`

Create a new progress bar directly using the export.

#### Example

```lua
exports['progressbar']:Progress({
    name = "random_task",
    duration = 5000,
    label = "Doing something",
    useWhileDead = false,
    canCancel = true,
    controlDisables = {
        disableMovement = false,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = true,
    },
    animation = {
        animDict = "mp_suicide",
        anim = "pill",
        flags = 49,
    },
    prop = {},
    propTwo = {}
}, function(cancelled)
    if not cancelled then
        -- Task completed
    else
        -- Task cancelled
    end
end)
```

#### Example with Props

```lua
exports['progressbar']:Progress({
    name = "random_task",
    duration = 5000,
    label = "Doing something",
    useWhileDead = false,
    canCancel = true,
    controlDisables = {
        disableMovement = false,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = true,
    },
    animation = {
        animDict = "missheistdockssetup1clipboard@base",
        anim = "pill",
        flags = 49,
    },
    prop = {
      model = 'prop_notepad_01',
      bone = 18905,
      coords = vec3(0.1, 0.02, 0.05),
      rotation = vec3(10.0, 0.0, 0.0),
    },
    propTwo = {
      model = 'prop_pencil_01',
      bone = 58866,
      coords = vec3(0.11, -0.02, 0.001),
      rotation = vec3(-120.0, 0.0, 0.0),
    }
}, function(cancelled)
    if not cancelled then
        -- Task completed
    else
        -- Task cancelled
    end
end)
```

---

# Additional Functions

### `isDoingSomething()`

Returns a boolean indicating whether a progressbar is active.

#### Example

```lua
local busy = exports["progressbar"]:isDoingSomething()
```

### `ProgressWithStartEvent(data, start, finish)`

Works like the regular progress bar, but with a start event triggered at the beginning.

### `ProgressWithTickEvent(data, tick, finish)`

Triggers a `tick` event on every frame while the progress bar is active.

### `ProgressWithTickEvent(data, start, tick, finish)`

This function includes both start and tick events, as well as a finish handler.

--- 

