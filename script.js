const api_url = 'https://pokeapi.co/api/v2/';
var request_details = new XMLHttpRequest();
var pokedata;

String.prototype.fcaps = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function change_image() {
    if ( document.getElementById('pokemon-front').classList.contains('d-none') ) {
        document.getElementById('pokemon-front').classList.remove("d-none");
        document.getElementById('pokemon-back').classList.add("d-none");
    } else if (document.getElementById('pokemon-back').classList.contains('d-none'))
    {
        document.getElementById('pokemon-front').classList.add("d-none");
        document.getElementById('pokemon-back').classList.remove("d-none");

    }
}

function pokemon_evolution(pokemon_species)
{
    document.getElementById("pokemon-evolution").innerHTML = '<h4>Evolution</h4>';
    var evolution_details = new XMLHttpRequest();
    evolution_details.open('GET', pokemon_species.evolution_chain.url , true);
    evolution_details.onload = function () {
          pokemon_evolution = JSON.parse(this.response);
          document.getElementById("pokemon-evolution").innerHTML += '<li>' + pokemon_evolution.chain.species.name.fcaps() + '</li>';
          console.log(pokemon_evolution);
          pokemon_evolution.chain.evolves_to.forEach(evolution => {
              document.getElementById("pokemon-evolution").innerHTML += '<li>' + evolution.species.name.fcaps() + '</li>';
              evolution.evolves_to.forEach(evolution2 => {
                document.getElementById("pokemon-evolution").innerHTML += '<li>' + evolution2.species.name.fcaps() + '</li>';
              });
          });


    }
    evolution_details.send()
}

function pokemon_species(pokemon_details)
{
    var species_details = new XMLHttpRequest();
    species_details.open('GET', pokemon_details.species.url , true);
    species_details.onload = function () {
          pokemon_species = JSON.parse(this.response);
          pokemon_evolution(pokemon_species);
          console.log(pokemon_species);
          pokemon_species.flavor_text_entries.forEach(flavor => {
              if(flavor.language.name == 'en')
              {
                document.getElementById("pokemon-info").innerHTML += flavor.flavor_text;
              }
          });
          document.getElementById("pokemon-stats").innerHTML += '<div class="col-md-2 col-4 p-2"><div class="card h-100 text-center p-2"><div class="display-4">'+ pokemon_species.base_happiness +'</div><h6>Happiness</h6></div></div>';
    }
    species_details.send()
}

function pokemon_stats(pokemon_details)
{
    pokemon_details.stats.forEach(stat => {
        document.getElementById("pokemon-stats").innerHTML += '<div class="col-md-2 col-4 p-2"><div class="card h-100 text-center p-2"><div class="display-4">'+ stat.base_stat +'</div><h6>'+ stat.stat.name +'</h6></div></div>';
    });

}

function pokemon_type(pokemon_details)
{
  document.getElementById("pokemon-types").innerHTML = '<b>Type: </b>';
  pokemon_details.types.forEach(type => {

        document.getElementById("pokemon-types").innerHTML += type.type.name.fcaps() + ', ';

        var request_type = new XMLHttpRequest();
        request_type.open('GET', api_url+'type/'+type.type.name + '/' , true);
        request_type.onload = function () {
          if (request_type.status >= 200 && request_type.status < 400) {
                var type_details = JSON.parse(this.response);
                document.getElementById("pokemon-half-damage-from").innerHTML = '<div class="font-weight-bold">Half-Damage From</div>';
                type_details.damage_relations.half_damage_from.forEach(type => {
                  document.getElementById("pokemon-half-damage-from").innerHTML += '<li>' + type.name.fcaps() + '</li>';
                });

                document.getElementById("pokemon-double-damage-from").innerHTML = '<div class="font-weight-bold">Double-Damage From</div>';
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
}

function search_pokemon()
{

  document.getElementById("pokemon-details").style.display = "block"
        var pokemon_searched = document.getElementById("search_name").value;
        request_details.open('GET', api_url+'pokemon/'+pokemon_searched.toLowerCase()+ '/', true);
        request_details.onload = function () {
             if (request_details.status >= 200 && request_details.status < 400) {

                  var pokemon_details = JSON.parse(this.response);
                  console.log(pokemon_details);

                  pokemon_species(pokemon_details);
                  pokemon_type(pokemon_details);
                  pokemon_stats(pokemon_details);

                  document.getElementById("pokemon-details").style.display = "block";

                  document.getElementById("pokemon-abilities").innerHTML = '<b>Abilities: </h3>';
                  pokemon_details.abilities.forEach(ability => {
                    document.getElementById("pokemon-abilities").innerHTML += ability.ability.name.fcaps() + ', ';
                  });

                  pokemon_details.moves.forEach(move => {
                    document.getElementById("pokemon-moves").innerHTML +=  move.move.name.fcaps() + ', ';
                  });


                  document.getElementById("pokemon-name").innerHTML = '<h1 class="h3 m-0">' + pokemon_searched.toUpperCase() + '</h1>';
                  document.getElementById("pokemon-abilities").innerHTML += '</ul>';
                  document.getElementById("pokemon-image").innerHTML = '<img id="pokemon-front" style="width: 96px;" src="' + pokemon_details.sprites.front_shiny + '">';
                  document.getElementById("pokemon-image").innerHTML += '<img id="pokemon-back" class="d-none" style="width: 96px;" src="' + pokemon_details.sprites.back_shiny + '">';
                  document.getElementById("pokemon-weight").innerHTML = '<span class="font-weight-bold">Weight:</span> ' + pokemon_details.weight + 'kg';
                  document.getElementById("pokemon-stats").innerHTML += '<div class="col-md-2 col-4 p-2"><div class="card h-100 text-center p-2"><div class="display-4">'+ pokemon_details.base_experience +'</div><h6>Happiness</h6></div></div>';

              }
              else
              {
                  document.getElementById("pokemon-details").innerHTML = '<h3>Pokemon Not Found</h3>'
              }
              document.getElementById("pokemon-details").style.display = "block"
            }
            request_details.send();
            setInterval(change_image, 1000);


    }
