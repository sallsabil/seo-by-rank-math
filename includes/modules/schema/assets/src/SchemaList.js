/**
 * External dependencies
 */
import { get, map, isEmpty } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { Button } from '@wordpress/components'
import { withSelect, withDispatch } from '@wordpress/data'

/**
 * Internal dependencies
 */
import { getSnippetIcon } from '@helpers/snippetIcon'
import DeleteConfirmation from './DeleteConfirmation'

/**
 * Schema list component.
 *
 * @param {Object} props This component's props.
 */
const SchemaList = ( { schemas, edit, trash, preview, showProNotice, setPrimary } ) => {
	if ( isEmpty( schemas ) ) {
		return null
	}

	return (
		<div className="rank-math-schema-in-use">
			<h4 className="rank-math-schema-section-title">{ __( 'Schema in Use', 'rank-math' ) }</h4>
			{ showProNotice && (
				<div className="components-notice rank-math-notice is-warning">
					<div className="components-notice__content">
						{ __( 'Multiple Schemas are allowed in the', 'rank-math' ) } <a href="https://rankmath.com/pro/?utm_source=Plugin&utm_medium=Schema%20Tab%20Notice&utm_campaign=WP" rel="noreferrer noopener" target="_blank"><strong>{ __( 'PRO Version [Coming Soon]', 'rank-math' ) }</strong></a>
					</div>
				</div>
			) }
			{ map( schemas, ( schema, id ) => {
				return (
					<div key={ id } id="rank-math-schema-item" className="rank-math-schema-item row">

						{ ! showProNotice && (
							<input
								type="radio"
								value={ id }
								checked={ schema.metadata.isPrimary }
								onChange={ () => setPrimary( id, schemas ) }
							/>
						) }
						<strong className="rank-math-schema-name">
							<i className={ getSnippetIcon( schema[ '@type' ] ) }></i>
							{ get( schema, 'metadata.title', schema[ '@type' ] ) }
						</strong>
						<span className="rank-math-schema-item-actions">
							<Button
								className="button rank-math-edit-schema"
								isLink
								onClick={ () => edit( id ) }
							>
								<i className="rm-icon rm-icon-edit"></i>
								<span>{ __( 'Edit', 'rank-math' ) }</span>
							</Button>
							<Button
								className="button rank-math-preview-schema"
								isLink
								onClick={ () => preview( id ) }
							>
								<i className="rm-icon rm-icon-eye"></i>
								<span>{ __( 'Preview', 'rank-math' ) }</span>
							</Button>
							<DeleteConfirmation
								key={ id }
								onClick={ () => trash( id ) }
							>
								{ ( setClicked ) => {
									return (
										<Button
											isLink
											className="button rank-math-delete-schema"
											onClick={ () => setClicked( true ) }
										>
											<i className="rm-icon rm-icon-trash"></i>
											<span>{ __( 'Delete', 'rank-math' ) }</span>
										</Button>
									)
								} }
							</DeleteConfirmation>
						</span>
					</div>
				)
			}
			) }
		</div>
	)
}

export default compose(
	withSelect( ( select ) => {
		const isPro = select( 'rank-math' ).isPro()
		const schemas = select( 'rank-math' ).getSchemas()
		const count = Object.keys( schemas ).length

		return {
			schemas,
			showProNotice: ! isPro && 1 <= count,
		}
	} ),
	withDispatch( ( dispatch ) => {
		return {
			trash( id ) {
				dispatch( 'rank-math' ).deleteSchema( id )
			},
			edit( id ) {
				dispatch( 'rank-math' ).setEditingSchemaId( id )
				dispatch( 'rank-math' ).toggleSchemaEditor( true )
			},
			preview( id ) {
				dispatch( 'rank-math' ).setEditingSchemaId( id )
				dispatch( 'rank-math' ).setEditorTab( 'codeValidation' )
				dispatch( 'rank-math' ).toggleSchemaEditor( true )
			},
			setPrimary( id, schemas ) {
				dispatch( 'rank-math' ).updatePrimary( id, schemas )
			},
		}
	} )
)( SchemaList )
