import { h, Component } from 'preact'
import { connect } from 'redux-bundler-preact'
import Pager from '../components/Pager'
import SortableTableHeader from '../components/SortableTableHeader'
    
class UserPage extends Component {
    constructor(props){
        super(props)
        this.handleHeaderClick = this.handleHeaderClick.bind(this)
        this.handlePageClick = this.handlePageClick.bind(this)
    }
    
    componentDidMount(){
        this.props.doFetchUsers()
    }
    
    handleHeaderClick(header){
        this.props.doSortResults(header)
    }
    
    handlePageClick(page){
        this.props.doSwitchPage(page)
    }
    
    render(){
        const { 
            currentResults, 
            numPages,
            users,
            userCount, 
            visibleMin, 
            visibleMax 
            
        } = this.props
        
        if(users.isLoading){
            return(<div>Loading...</div>)
        }
        
        if(userCount === 0){
            return(null)
        }
        
        let headerRow = users.headers.map(header => (
                
                <SortableTableHeader 
                    cellKey={header}
                    onClick={this.handleHeaderClick}
                    sortKey={users.sortKey}
                    sortAsc={users.sortAsc}
                    text={header.charAt(0).toUpperCase() + header.slice(1)}
                /> 
            ))
        
        let rows = currentResults.map(user => (
                <tr>
                    <td>{user.first}</td>
                    <td>{user.last}</td>
                    <td><a href={'mailto:' + user.email}>{user.email}</a></td>
                </tr>
            )
        )

        return(
            <div className="table-container">
                <table>
                    <thead>
                        <tr>{headerRow}</tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <div className="display-count">
                    Displaying: {visibleMin + 1} - {visibleMax} of {userCount}
                </div>
                <Pager 
                    currentPage={users.currentPage} 
                    numPages={numPages} 
                    navLead={2} 
                    onClick={this.handlePageClick} 
                />
            </div>
        )
    }
}

export default connect(
    'selectCurrentResults',
    'selectNumPages',
    'selectUsers',
    'selectUserCount', 
    'selectVisibleMin', 
    'selectVisibleMax',
    'doFetchUsers',
    'doSwitchPage',
    'doSortResults',
    UserPage)