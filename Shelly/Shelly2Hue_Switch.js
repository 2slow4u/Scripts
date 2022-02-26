let CONFIG = {
    ip: '<place your bride IP', //Hue Bridge IP
    user: '<place your userid', //Hue Bridge API user
    groups: '2', // Hue Groups ID
    input1: 0, // Shelly Button ID
};

// Set Switch detached
Shelly.call("Input.SetConfig", {
    id: 0,
      config: {
        type: "switch",
    },
});

Shelly.call("Switch.SetConfig", {
    id: 0,
      config: {
        in_mode: "detached",
        initial_state: "on"
    },
});


// add an evenHandler 
// && event.info.event === CONFIG.btnevent1
Shelly.addEventHandler(
    function (event, user_data) {
        //print(JSON.stringify(event));
        if (event.info.id === CONFIG.input1 && event.info.state) {
            // Get the current light state
            Shelly.call(
                "http.request", {
                    method: "GET",
                    url: 'http://' + CONFIG.ip + '/api/' + CONFIG.user + '/groups/' + CONFIG.groups,
					},
                    function (res, error_code, error_message, ud) {
                        let st = JSON.parse(res.body);
                        if (st.action.on === true) {
                            Toggle("false");
                        } else {
                            Toggle("true");
                        }
                },
                null
            );
        } else {
            return true;
        }
        
    },
);

function Toggle(state) {
    let b = '{"on":' + state + '}';

    Shelly.call(
        "http.request", {
        method: "PUT",
        url: 'http://' + CONFIG.ip + '/api/' + CONFIG.user + '/groups/' + CONFIG.groups + '/action',
        body: b
    },
        function (r, e, m) {
        },
        null
    );
}
