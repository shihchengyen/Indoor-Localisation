import React from 'react'
import moment from "moment";

import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";


const styles = {
    card: {
        maxWidth: 150,
        maxHeight: 200,
        color: "#ffffff",
    },
    normal: {
        backgroundColor: "#43a047",
    },
    warning: {
        backgroundColor: "#fb8c00",
    },
    error: {
        backgroundColor: "#e53935",
    },
    inactive: {
        backgroundColor: "#777777",
    },
};


class PatientReading extends React.Component {

    constructor() {
        super();
        this.state = {
            status: null,
            hr: 0,
            spo2: 0,
            tCur: moment()
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props && prevProps !== this.props) {
            let tCur = this.state.tCur
            const hr = this.props.displayCur ? this.props.patient.heart_rate : this.props.patient.heart_rate_prev
            const spo2 = this.props.displayCur ? this.props.patient.spo2 : this.props.patient.spo2_prev

            if (this.props.curCp && this.props.curCp !== tCur.hours()) {
                tCur = moment().set({hour: this.props.curCp, minute: 0, second: 0, millisecond: 0})
                if (moment().hours() < this.props.checkpoints[0]) {
                    tCur = tCur.subtract(1, 'days')
                }
                this.setState({tCur})
            }

            if (hr !== this.state.hr || spo2 !== this.state.spo2) {
                let status, hr_state, spo2_state

                hr_state = hr <= 90 ? 1 : 0
                spo2_state = (spo2 > 94 && spo2 < 100) ? 1 : 0

                if (!hr || !spo2) {
                    status = this.props.classes.inactive
                } else if (hr_state & spo2_state) {
                    status = this.props.classes.normal
                } else if (hr_state ^ spo2_state) {
                    status = this.props.classes.warning
                } else {
                    status = this.props.classes.error
                }
                this.setState({hr, spo2, status})
            }

        }
    }

    render() {
        return (
            <Card className={`${this.props.classes.card} ${this.state.status}`}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2" color={'inherit'}>
                        <strong>{this.props.patient.name}</strong>
                    </Typography>
                    <Typography gutterBottom variant="h6" component="p" color={'inherit'}>
                        HR: <strong>{this.state.hr}</strong>
                    </Typography>
                    <Typography variant="h6" component="p" color={'inherit'}>
                        SpO2: <strong>{this.state.spo2}</strong>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}


export default withStyles(styles)(PatientReading)