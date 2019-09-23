import React from 'react';
import TextField from '../../forms/form-fields/text-field';
import { isNumber } from 'd2-ui/lib/forms/Validators';
import { getOr } from 'lodash/fp';

function isPoint(poly) {
    return Array.isArray(poly) && (poly.length === 0 || (poly.length === 2));
}

function isValidLatitude(value) {
    return isNumber(value) && value <= 90 && value >= -90;
}
isValidLatitude.message = 'a_latitude_should_be_a_number_between_-90_and_90';

function isValidLongitude(value) {
    return isNumber(value) && value <= 180 && value >= -180;
}
isValidLongitude.message = 'a_longitude_should_be_a_number_between_-180_and_180';

class CoordinateField extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            //Use state for this, since props is a string due to API
            coords: [undefined, undefined], //long, lat
        };

        if (props.value) {
            try {
                this.state.coords = JSON.parse(props.value);
            } catch (e) {
                /* Preventing unnecessary errors in the console */
            }
        }

        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    }

    getLongitude = () => getOr(undefined, 'coords[0]', this.state);

    getLatitude = () => getOr(undefined, 'coords[1]', this.state);

    getLongLat = () => [this.getLongitude(), this.getLatitude()];

    updateLatLong(lat, long) {
        this.setState({
            coords: [long, lat]
        }, () => {
            if (!lat && !long) {
                this.props.onChange({ target: { value: '' } });
            } else {
                this.props.onChange({ target: { value: JSON.stringify(this.getLongLat()) } });
            }
        })
    }

    handleLatitude = (event) => {
        const lat = event.target.value.length > 0 ? event.target.value : undefined;
        const latError = !lat || isValidLatitude(lat) ? undefined: this.getTranslation(isValidLatitude.message)

        this.setState({ latError });
        this.updateLatLong(lat, this.getLongitude());
    }

    handleLongitude = (event) => {
        const long = event.target.value.length > 0 ? event.target.value : undefined;
        const longError = !long || isValidLongitude(long) ? undefined: this.getTranslation(isValidLongitude.message)

        this.setState({ longError });
        this.updateLatLong(this.getLatitude(), long);
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
                        value={this.getLatitude()}
                        onChange={this.handleLatitude}
                        errorText={this.state.latError}
                    />
                    <TextField
                        {...this.props}
                        labelText={this.getTranslation('longitude')}
                        value={this.getLongitude()}
                        onChange={this.handleLongitude}
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

// Used to actually prevent saving
export const validators = [
    {
        validator(value) {
            let coords = value

            try {
                coords = value ? JSON.parse(value) : null
            } catch(e) {
                return false;
            }

            if (!coords) {
                return true
            }

            // If true, coordinates are a polygon and can't be edited
            // anyways. Return "valid: true" to not block editing
            // of polygon org units
            if (!isPoint(coords)) {
                return true
            }

            const [long, lat] = coords;
            return isValidLongitude(long) && isValidLatitude(lat);
        },
        message: 'invalid_coordinate',
    },
];
export default CoordinateField;
