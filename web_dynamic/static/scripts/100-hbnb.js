$(document).ready(function () {
    let selectedStates = [];
    let selectedCities = [];
    let selectedAmenities = [];

    $('input[type="checkbox"]').change(function () {
        let id = $(this).data('id');
        let name = $(this).data('name');
        let type = $(this).closest('ul').parent().attr('class');

        if ($(this).is(':checked')) {
            if (type === 'locations') {
                if ($(this).closest('ul').find('li').length > 1) {
                    selectedCities.push(id);
                } else {
                    selectedStates.push(id);
                }
            } else if (type === 'amenities') {
                selectedAmenities.push(id);
            }
        } else {
            if (type === 'locations') {
                if ($(this).closest('ul').find('li').length > 1) {
                    selectedCities = selectedCities.filter(item => item !== id);
                } else {
                    selectedStates = selectedStates.filter(item => item !== id);
                }
            } else if (type === 'amenities') {
                selectedAmenities = selectedAmenities.filter(item => item !== id);
            }
        }

        let statesList = selectedStates.map(id => $('input[data-id="' + id + '"]').data('name')).join(', ');
        let citiesList = selectedCities.map(id => $('input[data-id="' + id + '"]').data('name')).join(', ');

        $('.locations h4').text(statesList + ', ' + citiesList);
    });

    $('button').click(function () {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                amenities: selectedAmenities,
                states: selectedStates,
                cities: selectedCities
            }),
            success: function (data) {
                $('.places').empty();
                data.forEach(place => {
                    $('.places').append(`
                        <article>
                            <div class="title_box">
                                <h2>${place.name}</h2>
                                <div class="price_by_night">$${place.price_by_night}</div>
                            </div>
                            <div class="information">
                                <div class="max_guest">${place.max_guest} Guest${place.max_guest != 1 ? 's' : ''}</div>
                                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms != 1 ? 's' : ''}</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? 's' : ''}</div>
                            </div>
                            <div class="user">
                                <b>Owner:</b> ${place.user.first_name} ${place.user.last_name}
                            </div>
                            <div class="description">
                                ${place.description}
                            </div>
                        </article>
                    `);
                });
            }
        });
    });
});

