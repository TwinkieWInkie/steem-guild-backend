function submitSteem() {
	const name = $('#lg_username').val();
	const privWif = $('#lg_password').val();

        var data = {
            username: name,
            wif: privWif
        };
        
        $.post(
            '/api/steems',
            data
        );
    alert('Data sent');
}


function keyFromPassword(username, password, role) {
    const wif = steem.auth.toWif(username, password, role);
    // const pubWif = steem.auth.wifToPublic(wif);

    return new Promise((resolve, reject) => {
        validateKey(username, wif, role, (err, isKeyValid) => {
            if (err != null) {
                reject(err)
            }

            if (isKeyValid) {
                resolve(wif)
            } else {
                reject(Error("Invalid Key"))
            }

        })
    })
}

