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
