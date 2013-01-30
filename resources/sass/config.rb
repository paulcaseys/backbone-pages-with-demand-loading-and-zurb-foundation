# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

output_style = :compressed #:expanded or :nested or :compact or :compressed

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
