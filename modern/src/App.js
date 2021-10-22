import React from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import { LegacyAppContainer } from './LegacyAppContainer'

const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => (
    <div className={classes.container}>
        <DataQuery query={query}>
            {({ error, loading, data }) => {
        		console.log(`Rendering modern app - React ${React.version}`)
                if (error) return <span>ERROR</span>
                if (loading) return <span>...</span>
                return (
					<LegacyAppContainer
						lazyModuleFetcher={() => import('./legacy/index.js')}
					/>
                )
            }}
        </DataQuery>
    </div>
)

export default MyApp
