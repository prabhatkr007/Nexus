export default function Post(){
    return(
    <div className='post'>
        <div className="image">
        <img src='https://techcrunch.com/wp-content/uploads/2020/03/GettyImages-1169993942.jpg?w=730&crop=1' alt="thumbnail"/>
        </div>
        <div className='text'>
        <h2>Chinese hackers raided US government email accounts by exploiting Microsoft cloud bug</h2>
        <p className="info">
        <a href="./" className="author">Prabhat Kumar</a>
        <time>13-07-2023 16:45</time>
        </p>
     
        <p className="summary">Chinese hackers exploited a flaw in Microsoft’s cloud email service to gain access to the email accounts of U.S. government employees, the technology giant has confirmed.</p>
        </div>
    </div>

    )
}