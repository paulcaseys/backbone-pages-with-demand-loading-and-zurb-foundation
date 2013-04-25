# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

output_style = :compressed #:expanded or :nested or :compact or :compressed


# Set this to the root of your project when deployed:
http_path = ""
images_dir = "../images"
relative_assets = true

# Load the sencha-touch framework automatically.
# load File.join(dir, '..', '..', 'sdk', 'resources', 'themes')

# Compass configurations
sass_path = dir
css_path = File.join(dir, "..", "css")

# Require any additional compass plugins here.
require "zurb-foundation"
# images_dir = File.join(dir, "..", "images")
# output_style = :compressed
# environment = :production
