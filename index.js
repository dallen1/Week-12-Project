class Band {
    constructor(name) {
        this.name = name;
        this.members = [];
    }

    addMember(name, instrument) {
        this.members.push(new Member(name, instrument));
    }
}

class Member {
    constructor(name, instrument) {
        this.name = name;
        this.instrument = instrument;
    }
}

class RESTService {
    //built from reference https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    
    static url = 'http://localhost:3000/bands'

    static async getAllBands() {      
        const response = await fetch(RESTService.url);
        const jsonData = await response.json();
        return jsonData;
    
    }

    static async getBand(id) {
        const response = await fetch(RESTService.url + `/${id}`);
        const jsonData = await response.json();
        return jsonData;
    }

    static async createBand(band) {
        try {
            const response = await fetch(RESTService.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(band),
            });
        
            const result = await response.json();
            console.log("Success:", result);
        } catch (error) {
            console.error("Error:", error);
        }
        
        
        const data = { name: band, members: [] };
        return data;
    }

    static async updateBand(band) {
    try {
        const response = await fetch(RESTService.url+ `/${band.id}`, {
        method: "PUT", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(band),
        });

        const result = await response.json();
        console.log("Success:", result);
        } catch (error) {
            console.error("Error:", error);
        }


        const data = { name: band, members: [] };
        return data;
    }

    static async deleteBand(id) {
        const response = await fetch(RESTService.url + `/${id}`, {method: "DELETE"});
        const jsonData = await response.json();
        return jsonData;
    }
}

class DOMHandler {
    static bands;

    static getAllBands() {
        RESTService.getAllBands().then(bands => this.render(bands));
    }

    static createBand(name) {
        RESTService.createBand(new Band(name))
        .then(() => {
            return RESTService.getAllBands();
        })
        .then((bands) => this.render(this.bands));
    }

    static deleteBand(id) {
        RESTService.deleteBand(id)
        .then(() => {
            return RESTService.getAllBands();
        })
        .then((bands) => this.render(this.bands));
    }

    static addMember(id) {
        for (let band of this.bands) {
            if (band.id == id) {
                band.members.push(new Member(document.querySelector(`#band-${band.id}-member-name`).value,
                    document.querySelector(`#band-${band.id}-member-instrument`).value));

                RESTService.updateBand(band)
                .then(() => {
                    return RESTService.getAllBands();
                })
                .then((bands) => this.render(this.bands));
            }
        }
    }

    static deleteMember(bandId, memberName) {
        for (let band of this.bands) {
            if (bandId == band.id) {
                for (let member of band.members) {
                    if (member.name == memberName) {
                        band.members.splice(band.members.indexOf(member), 1);
                        RESTService.updateBand(band)
                        .then(() => {
                            return RESTService.getAllBands();
                        })
                        .then((bands) => this.render(this.bands));
                    }


                }
            }
        }
    }

    static render(bands) {
        this.bands = bands;
        const app = document.querySelector('#app');
        while (app.lastChild) {
            app.removeChild(app.lastChild);
        };
        for (let band of bands) {
            app.innerHTML += 
            `<div id="band-${band.id}" class="card">
            <div class="card-header">
            <h2>${band.name}</h2>
            <button class="btn btn-danger" onclick="DOMHandler.deleteBand('${band.id}')">Delete</button>
            </div>

            <div class="card-body">
            <div class="card">
              <div class="row">
                  <div class="col-sm">
                      <input type="text" id="band-${band.id}-member-name" class="form-control" placeholder="Band Member Name">
                  </div>
                  <div class="col-sm">
                  <input type="text" id="band-${band.id}-member-instrument" class="form-control" placeholder="Instrument">
                  </div>
              </div>  
              <button id="band-${band.id}-new-member" onclick="DOMHandler.addMember('${band.id}')" class="btn btn-primary form-control">Add</button>                
            </div> 
            <br>
            </div>              
            </div><br>`
        };
        for (let band of bands) {
        for (let member of band.members) {
            let cardBody = document.querySelector(`#band-${band.id} > .card-body`);
            cardBody.innerHTML +=`<p>
                  <span id="name-${member.name}"><strong>Name: </strong> ${member.name}</span>&nbsp;
                  <span id="instrument-${member.instrument}"><strong>Instrument: </strong> ${member.instrument}</span>
                  <button class="btn btn-danger" onclick="DOMHandler.deleteMember('${band.id}', '${member.name}')")>Delete Room</button>`;
            
        }
    }
    }
}

$('#create-new-band').click(() => {
    let val = document.querySelector('#new-band-name').value
    DOMHandler.createBand(val);
});

DOMHandler.getAllBands();