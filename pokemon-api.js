const api_url = 'https://pokeapi.co/api/v2/';		
var request_details = new XMLHttpRequest();
var pokedata;
			
String.prototype.fcaps = function() {
	  return this.charAt(0).toUpperCase() + this.slice(1);
}
 
function search_pokemon()
{
        var pokemon_searched = document.getElementById("search_name").value;				
        request_details.open('GET', api_url+'pokemon/'+pokemon_searched.toLowerCase(), true);
        request_details.onload = function () {
             if (request_details.status >= 200 && request_details.status < 400) {
		    
                var pokemon_details = JSON.parse(this.response);
		
		document.getElementById("pokemon-details").style.display = "block";
                
		document.getElementById("pokemon-abilities").innerHTML = '<h3>Abilities</h3><ul>';
                pokemon_details.abilities.forEach(ability => {
                  document.getElementById("pokemon-abilities").innerHTML += '<li>' + ability.ability.name.fcaps() + '</li>';
                });

                document.getElementById("pokemon-types").innerHTML = '<h3>Type</h3><ul>';
                pokemon_details.types.forEach(type => {
                  document.getElementById("pokemon-types").innerHTML += '<li>' + type.type.name.fcaps() + '</li>';

                  var request_type = new XMLHttpRequest();
                  request_type.open('GET', api_url+'type/'+type.type.name , true);
                  request_type.onload = function () {
                    if (request_type.status >= 200 && request_type.status < 400) {
                      var type_details = JSON.parse(this.response);
                      document.getElementById("pokemon-half-damage-from").innerHTML = '<div class="font-weight-bold">Half-Damage</div>';
                      type_details.damage_relations.half_damage_from.forEach(type => {
                        document.getElementById("pokemon-half-damage-from").innerHTML += '<li>' + type.name.fcaps() + '</li>';
                      });

                      document.getElementById("pokemon-double-damage-from").innerHTML = '<div class="font-weight-bold">Double-Damage</div>';
                      type_details.damage_relations.double_damage_from.forEach(type => {
                        document.getElementById("pokemon-double-damage-from").innerHTML += '<li>' + type.name.fcaps() + '</li>';
                      });

                      document.getElementById("pokemon-half-damage-to").innerHTML = '<div class="font-weight-bold">Half-Damage To</div>';
                      type_details.damage_relations.half_damage_to.forEach(type => {
                        document.getElementById("pokemon-half-damage-to").innerHTML += '<li>' + type.name.fcaps() + '</li>';
                      });

                      document.getElementById("pokemon-double-damage-to").innerHTML = '<div class="font-weight-bold">Double-Damage To</div>';
                      type_details.damage_relations.double_damage_to.forEach(type => {
                        document.getElementById("pokemon-double-damage-to").innerHTML += '<li>' + type.name.fcaps() + '</li>';
                      });

                    }
                  }
                  request_type.send();

                });

                document.getElementById("pokemon-name").innerHTML = '<h1 class="m-0 d-inline">' + pokemon_searched.toUpperCase() + '</h1>';
                document.getElementById("pokemon-abilities").innerHTML += '</ul>';
                document.getElementById("pokemon-image").innerHTML = '<img style="width: 96px;" src="' + pokemon_details.sprites.front_default + '">';
                document.getElementById("pokemon-weight").innerHTML = '<span class="font-weight-bold">Weight:</span> ' + pokemon_details.weight + 'kg';
              } 
              else 
              {	
                  document.getElementById("pokemon-details").innerHTML = '<h3>Pokemon Not Found</h3>' 
              }
            }
            request_details.send();

    }
