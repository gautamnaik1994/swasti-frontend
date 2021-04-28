
window.addEventListener('load', function() {
var inputs = document.querySelectorAll( '.input-file' );
console.log(inputs)
Array.prototype.forEach.call( inputs, function( input )
{
	var label	 = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener( 'change', function( e )
	{
		var fileName = '';
		fileName = e.target.value.split( '\\' ).pop();

		if( fileName )
			label.innerHTML = fileName;
		else
			label.innerHTML = labelVal;
	});
});
    console.log('All assets are loaded')
})
