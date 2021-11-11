import React from 'react'
import { Formik, Form } from 'formik'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '../atoms/inputs/buttons/Button'
import Text from '../atoms/inputs/Text'
import Select from '../atoms/inputs/Select'
import DateTime from '../atoms/inputs/DateTime'

const useStyles = makeStyles(theme => ({
    assetWrapper: { 
        marginBottom: '16px'
    },
    subtitle: {
        fontSize: '18px',
        marginTop: '2px'
    },
    label: {
        marginRight: '16px',
        fontWeight: 700
    },
    sublabel: {
        fontWeight: 500,
        marginTop: '2px'
    },
    suggestInput: {
        maxWidth: '250px'
    }
}));

const categories = [
    'preIPO',
    'crypto',
    'real estate',
    'NFT'
].map((label, idx) => {
  return {label, value:idx.toString()}
})

const SuggestAssetForm = () => {
    const classes = useStyles();

    return (
        <div>
            <Typography variant="h3">Suggestion Form</Typography>
            <p className={classes.subtitle}>What asset would you like priced by Lithium?</p>
            <Formik
                initialValues={{
                    assetName: '',
                    pricingTime: ''
                }}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500));
                    console.log(JSON.stringify(values, null, 2));
                }}
            >
                <Form>
                    <div>
                        <Text
                            sx={{
                                '& .MuiTextField-root': {
                                    flexDirection: 'column !important'
                                }
                            }}
                            label="Enter asset name or symbol below:"
                            name="assetName"
                            type="text"
                            wrapperClass={classes.assetWrapper}
                            InputLabelProps={{classes: { root: classes.label }, shrink: false}}
                        />
                    </div>

                    <div>
                        <label className={classes.label}>Select an asset category:</label>
                        <br />
                        <Select
                            name='category'
                            options={categories}
                            value=''
                        />
                    </div>

                    <div>
                        <br />
                        <label className={classes.label}>What date / time do you want this asset priced?</label>
                        <p className={classes.sublabel}>(Ex. You want to know the price of Metamask on Nov 1, 2021)</p>
                        <DateTime
                            name="pricingTime"
                        />

                        <Text
                            sx={{
                                '& .MuiTextField-root': {
                                    flexDirection: 'column !important'
                                }
                            }}
                            label="Enter email if you would like be notified when it is available (optional):"
                            name="suggestEmail"
                            type="text"
                            wrapperClass={classes.assetWrapper}
                            InputProps={{classes: { root: classes.suggestInput }}}
                            InputLabelProps={{classes: { root: classes.label }, shrink: false}}
                        />

                        <Button
                            label="Submit Suggestion"
                            type="submit"
                        />
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default SuggestAssetForm