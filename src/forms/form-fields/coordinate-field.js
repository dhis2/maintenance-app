import React from 'react';
import TextField from '../../forms/form-fields/text-field';
import { isNumber } from 'd2-ui/lib/forms/Validators';

function isPoint(poly) {
    return Array.isArray(poly) && (poly.length === 0 || (poly.length === 2 && !isNaN(poly[0]) && !isNaN(poly[1])));
}

function isValidLatitude(value) {
    return isNumber(value) && value <= 90 && value >= -90;
}
isValidLatitude.message = "a_latitude_should_be_a_number_between_-90_and_90";

function isValidLongitude(value) {
    return isNumber(value) && value <= 180 && value >= -180;
}
isValidLongitude.message = "a_longitude_should_be_a_number_between_-180_and_180";

class CoordinateField extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            long: undefined,
            lat: undefined,
            coords: [],
        };

        if (props.value) {
            try {
                this.state.coords = JSON.parse(props.value);
            } catch (e) {
                /* Preventing unnecessary errors in the console */
            }

            if (isPoint(this.state.coords)) {
                this.state.lat = this.state.coords[1];
                this.state.long = this.state.coords[0];
            }
        }

        this.updateLatLong = this.updateLatLong.bind(this);
        this.updateLatitude = this.updateLatitude.bind(this);
        this.updateLongitude = this.updateLongitude.bind(this);

        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    }

    updateLatLong(lat, long) {
        this.setState(state => ({
            lat,
            long,
            coords: isPoint(state.coords) && lat && long ? [long, lat] : state.coords,
        }), () => {
            if (lat && long && isPoint(this.state.coords)) {
                this.props.onChange({ target: { value: `[${this.state.coords[0]},${this.state.coords[1]}]` } });
            } else {
                this.props.onChange({ target: { value: '' } });
            }
        });
    }

    updateLatitude(event) {
        const lat = event.target.value.length > 0 ? event.target.value : undefined;
        const long = this.state.long;

        if (!isValidLatitude(lat)) {
            this.setState({ latError: this.getTranslation(isValidLatitude.message) });
        } else {
            this.setState({ latError: undefined });
            this.updateLatLong(lat, long);
        }
    }

    updateLongitude(event) {
        const lat = this.state.lat;
        const long = event.target.value;

        if (!isValidLongitude(long)) {
            this.setState({ longError: this.getTranslation(isValidLongitude.message) });
        } else {
            this.setState({ longError: undefined });
            this.updateLatLong(lat, long);
        }
    }

    render() {
        const coords = this.state.coords;

        //
        // Lat/long fields should show if:
        // - There are no coordinates
        // - There's an existing point coordinate, which is an array of 2 numbers
        //
        if (isPoint(coords)) {
            return (
                <div>
                    <TextField
                        {...this.props}
                        labelText={this.getTranslation('latitude')}
                        value={this.state.lat}
                        onChange={this.updateLatitude}
                        errorText={this.state.latError}
                    />
                    <TextField
                        {...this.props}
                        labelText={this.getTranslation('longitude')}
                        value={this.state.long}
                        onChange={this.updateLongitude}
                        errorText={this.state.longError}
                    />
                </div>
            );
        }

        //
        // For polygon coordinates, which is an array of point coordinates,
        // display a disabled text field with info
        //
        return (
            <TextField
                {...this.props}
                labelText={this.getTranslation('coordinates')}
                value={this.getTranslation('polygon_coordinates_are_not_editable')}
                disabled
            />
        );
    }
}
CoordinateField.propTypes = { value: React.PropTypes.string, onChange: React.PropTypes.func.isRequired };
CoordinateField.contextTypes = { d2: React.PropTypes.object.isRequired };

export default CoordinateField;
